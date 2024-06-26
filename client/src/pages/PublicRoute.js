import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem("token");
  return !isAuthenticated ? <Component {...rest} /> : <Navigate to="/dashboard" />;
};

export default PublicRoute;
