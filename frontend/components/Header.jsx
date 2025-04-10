import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Menu, X } from "lucide-react"; // Hamburger & close icon

const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
    navigate("/signin");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavClick = (route) => {
    navigate(route);
    setMenuOpen(false); // Close menu on nav
  };

  return (
    <header className="fixed w-full z-50  shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="relative">
            <span className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Mi<span className="text-blue-300">AI</span>
            </span>
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-400/50 to-purple-500/30 rounded-full"></span>
          </span>
        </div>

        {/* Desktop Navigation */}
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
          <NavLink
            to="/faq"
            className="relative text-gray-300 hover:text-white transition-colors group"
          >
            FAQs
            <span className="absolute left-0 -bottom-1 h-0.5 bg-blue-500 transition-all duration-300 w-0 group-hover:w-full"></span>
          </NavLink>
        </nav>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Auth Buttons (desktop only) */}
        <div className="hidden md:flex">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-full font-medium bg-red-600 text-white hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/signin")}
              className="px-6 py-2 rounded-full font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4  backdrop-blur-md shadow-lg space-y-4">
          <NavLink
            onClick={() => handleNavClick("/gemini")}
            className="block text-gray-300 hover:text-white"
          >
            AskAI
          </NavLink>
          <NavLink
            onClick={() => handleNavClick("/subscribe")}
            className="block text-gray-300 hover:text-white"
          >
            Try MyAI Advance
          </NavLink>
          <NavLink
            onClick={() => handleNavClick("/faq")}
            className="block text-gray-300 hover:text-white"
          >
            FAQs
          </NavLink>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => handleNavClick("/signin")}
              className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
