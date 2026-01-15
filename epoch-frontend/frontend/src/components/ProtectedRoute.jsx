import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== role) return <Navigate to="/" />;
  } catch {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
