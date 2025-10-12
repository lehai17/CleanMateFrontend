// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // Nếu chưa login thì chuyển hướng sang /login
    return <Navigate to="/login" replace />;
  }

  // Nếu đã login thì render page con
  return children;
}
