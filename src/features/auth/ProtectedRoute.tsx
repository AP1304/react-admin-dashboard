import { Navigate } from "react-router-dom";
import { useAuth, type Role } from "./AuthContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p style={{ padding: "20px" }}>Checking authentication...</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;