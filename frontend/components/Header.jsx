import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");// Update state
    navigate("/signin"); // Redirect to signin page
  };

  return (
    <header className="fixed w-full z-50 ">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo with subtle shine effect */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="relative">
            <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Mi<span className="text-blue-300">AI</span>
            </span>
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-400/50 to-purple-500/30 rounded-full"></span>
          </span>
        </div>

        {/* Navigation Links with animated underline */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink
            to="/gemini"
            className="relative text-gray-300 hover:text-white transition-colors group"
          >
            AskAI
            <span className="absolute left-0 -bottom-1 h-0.5 bg-blue-500 transition-all duration-300 w-0 group-hover:w-full"></span>
          </NavLink>

          <NavLink
            to="/subscribe"
            className="relative text-gray-300 hover:text-white transition-colors group"
          >
            <span className="flex items-center">
              Try MyAI Advance
              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                NEW
              </span>
            </span>
            <span className="absolute left-0 -bottom-1 h-0.5 bg-purple-500 transition-all duration-300 w-0 group-hover:w-full"></span>
          </NavLink>

          <NavLink to="/faq">
            <button className="relative text-gray-300 hover:text-white transition-colors group">
              FAQs
              <span className="absolute left-0 -bottom-1 h-0.5 bg-blue-500 transition-all duration-300 w-0 group-hover:w-full"></span>
            </button>
          </NavLink>
        </nav>

        {/* Sign In / Logout Button */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="relative overflow-hidden group px-6 py-2 rounded-full font-medium transition-all duration-300 bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/signin")}
            className="relative overflow-hidden group px-6 py-2 rounded-full font-medium transition-all duration-300"
          >
            <span className="relative z-10 flex items-center text-white">
              Sign In
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
