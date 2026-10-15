import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({
  children,
  allowed,
  requireCleaner = false,
}) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (
    allowed &&
    !allowed.includes(user.role) &&
    !allowed.includes(String(user.role))
  ) {
    return <Navigate to="/" replace />;
  }

  if (requireCleaner && !user.isCleaner && user.role !== "Cleaner") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
