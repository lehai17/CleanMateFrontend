// src/components/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, allowed }) {
  const { user } = useAuth();
  const loc = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;

  if (
    allowed &&
    !allowed.includes(user.role) &&
    !allowed.includes(String(user.role))
  ) {
    // không đủ quyền -> về trang chủ (hoặc 403 page)
    return <Navigate to="/" replace />;
  }
  return children;
}
