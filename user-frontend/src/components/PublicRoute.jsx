import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or loader

  // 🔥 If already logged in → redirect
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}