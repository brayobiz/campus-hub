import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useUserStore((s) => s.user);

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // If user exists but no campus selected, redirect to campus picker
  // (This will be managed by campus store in the future)

  return <>{children}</>;
};

export default ProtectedRoute;
