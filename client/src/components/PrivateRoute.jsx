import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const PrivateRoute = () => {
  const currentUser = null;
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
