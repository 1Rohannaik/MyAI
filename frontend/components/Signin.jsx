import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import toast from "react-hot-toast";


const Signin = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
        "https://myai-backend-i80t.onrender.com/api/v1/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store token
        toast.success("Signed in successfully!");
        navigate("/gemini");
      } else {
        setError(data.message || "Signup failed");
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
            Welcome
          </h1>
          <p className="text-gray-400 text-center text-sm mb-5">
            Sign up for your account
          </p>

          {error && <p className="text-red-500 text-center mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

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

            <div className="flex items-center text-sm text-gray-300">
              <input type="checkbox" className="h-3 w-3 text-blue-600" />
              <label className="ml-1">Remember me</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-all"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-400">
            <p>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                Log in here
              </span>
            </p>
          </div>

          <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-400">
            <a href="#">Help</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signin;
