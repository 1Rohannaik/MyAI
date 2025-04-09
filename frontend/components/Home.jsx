import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if a token is stored in localStorage
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleTryForFree = () => {
    if (isLoggedIn) {
      navigate("/gemini"); // Redirect to /gemini if the user is logged in
    } else {
      navigate("/signin"); // Redirect to /signin if the user is not logged in
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-700 to-black text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 sm:pt-32">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Text Content */}
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Supercharge
                </span>{" "}
                your creativity <br />
                and productivity
              </h1>

              <p className="text-lg text-gray-400">
                Chat to start writing, planning, learning and more with AI
              </p>

              <button
                onClick={handleTryForFree}
                className="relative overflow-hidden group px-8 py-3 rounded-full font-medium text-white mt-6"
              >
                <span className="relative z-10">3-free prompts</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>

            {/* Image */}
            <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-xl">
                <img
                  src="https://images.pexels.com/photos/3755707/pexels-photo-3755707.jpeg"
                  alt="AI Technology"
                  className="rounded-2xl shadow-2xl border border-gray-700 w-full h-auto transition-all duration-500 hover:scale-105"
                />
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 blur-lg -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
