import { Navigate, Outlet } from "react-router-dom";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Please sign in to continue.");
    }
  }, [token]);

  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
