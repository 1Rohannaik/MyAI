import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If already logged in, redirect to /gemini
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/gemini");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://myai-backend-i80t.onrender.com/api/v1/users/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/gemini");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-700 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700 p-6">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-xl font-bold text-center text-white mb-1">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-center text-sm mb-5">
            Log in to your account
          </p>

          {error && <p className="text-red-500 text-center mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="my-5 w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition-all"
            >
              Log In
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-400">
            <p>
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signin")}
                className="text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                Sign up now
              </span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
