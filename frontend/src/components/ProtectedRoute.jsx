import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && role !== allowedRole) {
    alert("Akses ditolak!");
    return <Navigate to="/" />;
  }

  return children;
}
