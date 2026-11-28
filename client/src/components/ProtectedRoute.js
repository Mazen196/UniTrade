import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Only logged-in users can see the wrapped page.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="subtitle">Loading...</p>;
  return user ? children : <Navigate to="/login" replace />;
}
