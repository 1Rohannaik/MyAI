import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosHelpCircleOutline } from "react-icons/io";
import {
  IoTimerOutline,
  IoSettingsOutline,
  IoSendSharp,
  IoCopyOutline,
  IoCheckmarkDone,
} from "react-icons/io5";
import { FaMicrophone, FaImage, FaTrash } from "react-icons/fa";

const cleanResponse = (response) => {
  return response
    .replace(/[***!\/.]/g, "")
    .replace(/\*\*\*\/\/ ##.*\n/g, "")
    .replace(/\n+/g, "\n");
};

const MessageBubble = ({ message, onCopy }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    if (message.type === "ai") {
      Prism.highlightAll();
    }
  }, [message]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex ${
        message.type === "user" ? "justify-end" : "justify-start"
      } mb-4 px-4`}
    >
      <div className={`relative group max-w-[90%]`}>
        {message.type === "ai" ? (
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 border border-gray-700/40 rounded-2xl p-5 text-gray-100 shadow-2xl shadow-gray-900/40 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-900/15 to-purple-900/15 pointer-events-none"></div>
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/30 to-gray-950/80 pointer-events-none"></div>

              <ReactMarkdown
                children={cleanResponse(message.text)}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline ? (
                      <div className="relative my-3">
                        <div className="flex items-center justify-between bg-gray-900/80 border-b border-gray-700/50 px-4 py-2 rounded-t-lg">
                          <div className="flex space-x-2"></div>
                          {match && (
                            <span className="text-xs font-mono text-gray-400">
                              {match[1]}
                            </span>
                          )}
                        </div>
                        <pre
                          className={`language-${match ? match[1] : "text"} 
                      bg-gray-950/95 border border-gray-700/50 rounded-b-lg 
                      overflow-auto shadow-inner shadow-black/40`}
                        >
                          <code
                            className={`language-${match ? match[1] : "text"} 
                        block py-3 px-4 font-mono text-sm leading-snug`}
                            {...props}
                          >
                            {children}
                          </code>
                        </pre>
                      </div>
                    ) : (
                      <code className="bg-gray-700/80 px-2 py-1 rounded-md text-sm border border-gray-600/40 font-mono">
                        {children}
                      </code>
                    );
                  },
                }}
              />

              <button
                onClick={handleCopy}
                className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out"
              >
                <div className="p-1.5 bg-gray-700/70 hover:bg-gray-600/70 rounded-full backdrop-blur-md border border-gray-600/30 shadow-sm hover:shadow-md transition-all">
                  {copied ? (
                    <IoCheckmarkDone className="text-green-400/90" size={16} />
                  ) : (
                    <IoCopyOutline
                      className="text-gray-300/90 hover:text-white"
                      size={16}
                    />
                  )}
                </div>
              </button>
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-blue-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ) : (
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600/40 via-blue-700/30 to-indigo-800/20 border border-blue-600/40 rounded-2xl p-5 text-white shadow-xl shadow-blue-900/30 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-blue-400/10 pointer-events-none"></div>
              <p className="relative text-white/95 drop-shadow-sm">
                {message.text}
              </p>
              <div className="absolute -inset-1 rounded-2xl bg-blue-500/10 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Gemini = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [sessionId, setSessionId] = useState(uuidv4());
  const [isLoading, setIsLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  // const { user } = useUser();
  // const isPremium = user?.isPremium;
  const messagesEndRef = useRef(null);

  const toggleNavbar = () => setExpanded(!expanded);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    Prism.highlightAll();
  }, [messages]);

  const sendToOpenRouter = async (prompt) => {
    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        throw new Error("Please login to continue");
      }

      const apiUrl = "https://myai-backend-i80t.onrender.com/api/openrouter/generate";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
        credentials: "include", 
      });

      clearTimeout(timeoutId);

      // Handling 403 specifically
      if (response.status === 403) {
        const errorData = await response.json();
        if (errorData.error?.toLowerCase().includes("token")) {
          localStorage.removeItem("token");
          navigate("/login?session_expired=true");
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(errorData.message || "Access denied");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      return data.reply || "I couldn't generate a response. Please try again.";
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("API Error:", err);

      // Handle different error types
      if (err.name === "AbortError") {
        return "Request took too long. Please try again.";
      }
      if (err.message.includes("Failed to fetch")) {
        return "Network error. Check your connection and try again.";
      }
      if (err.message.includes("session") || err.message.includes("login")) {
        return "";
      }
      return `Error: ${err.message}`;
    } finally {
      setIsLoading(false);
    }
  };
  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const newUserMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setUsageCount((prev) => prev + 1);

    try {
      const aiResponse = await sendToOpenRouter(input);
      setMessages((prev) => [...prev, { type: "ai", text: aiResponse }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "Sorry, I encountered an error processing your request. Please try again.",
        },
      ]);
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]?.text || "New Chat";
      setChatHistory((prev) => [
        { session_id: sessionId, searchQuery: lastMessage },
        ...prev,
      ]);
    }

    setMessages([]);
    setInput("");
    setSessionId(uuidv4());
  };

  const handleHistoryItemClick = (selectedSessionId) => {
    const session = chatHistory.find((s) => s.session_id === selectedSessionId);
    if (session) {
      setMessages([{ type: "user", text: session.searchQuery }]);
      setSessionId(selectedSessionId);
    }
  };

  const handleClearHistoryItem = (id, e) => {
    e.stopPropagation();
    setChatHistory((prev) => prev.filter((chat) => chat.session_id !== id));
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-700 to-black">
      <div
        className={`h-screen bg-gradient-to-br from-slate-950 via-slate-800 to-slate-900 ${
          expanded ? "w-56" : "w-16"
        } flex flex-col justify-between transition-all duration-400 overflow-hidden`}
      >
        <div className="flex flex-col items-center w-full gap-6 py-4">
          <button
            onClick={toggleNavbar}
            className="text-white text-2xl cursor-pointer hover:text-blue-400 transition-colors"
          >
            <GiHamburgerMenu />
          </button>
          <button
            onClick={handleNewChat}
            className="text-white text-3xl bg-slate-800 h-10 w-10 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            +
          </button>
          {expanded && <p className="text-white text-sm">New chat</p>}
        </div>

        <div className="flex flex-col flex-grow overflow-y-auto px-2">
          {chatHistory.map((chat) => (
            <div
              key={chat.session_id}
              className="flex items-center justify-between group px-2 py-1 rounded-lg hover:bg-zinc-700/50 transition-colors"
              onClick={() => handleHistoryItemClick(chat.session_id)}
            >
              <button className="text-white text-left px-2 py-2 rounded-lg w-full truncate text-sm">
                {chat.searchQuery}
              </button>
              {expanded && (
                <button
                  onClick={(e) => handleClearHistoryItem(chat.session_id, e)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-400 p-1 transition-opacity"
                >
                  <FaTrash className="text-xs" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center w-full gap-4 py-4">
          <NavbarItem
            icon={<IoIosHelpCircleOutline className="text-white text-xl" />}
            label="Help"
            expanded={expanded}
          />
          <NavbarItem
            icon={<IoTimerOutline className="text-white text-xl" />}
            label="Time"
            expanded={expanded}
          />
          <NavbarItem
            icon={<IoSettingsOutline className="text-white text-xl" />}
            label="Settings"
            expanded={expanded}
          />
        </div>
      </div>
      <div className="flex flex-col flex-grow items-center p-6 relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 right-6 text-white hover:text-blue-400 transition-colors p-2 bg-gray-700/50 rounded-full hover:bg-gray-600/50 backdrop-blur-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        <h1 className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
          Hello, How can I help you today?
        </h1>

        <div className="w-full max-w-4xl h-[450px] mt-2 overflow-y-auto flex flex-col gap-4">
          <img
            src="https://imgs.search.brave.com/z7fwA0qAHiZLXNtEDn-C_2xMweFLhC3FpzfLMRD2zdQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZWdp/c3RyeS5ucG1taXJy/b3IuY29tL0Bsb2Jl/aHViL2ljb25zLXN0/YXRpYy1wbmcvbGF0/ZXN0L2ZpbGVzL2Rh/cmsvZ2VtaW5pLWNv/bG9yLnBuZw"
            alt="logo"
            className="h-10 w-10 sticky"
          />
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} onCopy={handleCopy} />
          ))}
          {isLoading && (
            <div className="flex justify-start px-4 mb-3">
              <div className="bg-zinc-800/80 border border-zinc-700 rounded-xl p-4 text-blue-400 max-w-[85%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="relative w-full max-w-3xl mt-28">
          <div className="relative flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              type="text"
              placeholder="Message Mi AI..."
              className="w-full h-14 rounded-full bg-zinc-800 border border-zinc-700 focus:border-zinc-600 text-white pl-12 pr-14 focus:outline-none"
              disabled={isLoading}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <FaMicrophone className="text-white text-lg cursor-pointer" />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer disabled:opacity-50"
            >
              <IoSendSharp />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavbarItem = ({ icon, label, expanded }) => (
  <div className="flex items-center gap-2">
    <div>{icon}</div>
    {expanded && <p className="text-white">{label}</p>}
  </div>
);

export default Gemini;
