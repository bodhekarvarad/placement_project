import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (role && user.role !== role) {
    const dashboard =
      user.role === "professor"
        ? "/professor/dashboard"
        : "/student/dashboard";

    return <Navigate to={dashboard} replace />;
  }

  return children;
};

export default ProtectedRoute;

