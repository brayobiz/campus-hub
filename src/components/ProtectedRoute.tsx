import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useCampusStore } from "../store/useCampusStore";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useUserStore((s) => s.user);
  const campus = useCampusStore((s) => s.campus);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after first render to allow persisted stores to load from localStorage
    setIsHydrated(true);
  }, []);

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // If user exists but no campus selected, redirect to campus picker
  // Only enforce this check after hydration to avoid false redirects during store rehydration
  if (isHydrated && !campus) {
    return <Navigate to="/auth/campuspicker" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
