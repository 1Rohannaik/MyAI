import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Signin from "../components/Signin";
import Home from "../components/Home";
import Gemini from "../components/Gemini";
import Login from "../components/Login";
import Subscribe from "../components/Subscribe";
import FAQ from "../components/Faq";
import ProtectedRoute from "../components/ProtectedRoute";
import Header from "../components/Header";
import Payment from "../components/Payment";
import { Toaster } from "react-hot-toast";

function App() {
  const location = useLocation();
  const hideLayoutRoutes = ["/gemini"];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <div className="flex">
      <div className="flex-1">
        {/* Toast notifications */}
        <Toaster position="top-right" reverseOrder={false} />

        {/* Conditionally show Header */}
        {!shouldHideLayout && <Header />}

        {/* Routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Payment Route */}
          <Route path="/payment/:plan" element={<Payment />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/gemini" element={<Gemini />} />
            <Route path="/subscribe" element={<Subscribe />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}


export default App;
