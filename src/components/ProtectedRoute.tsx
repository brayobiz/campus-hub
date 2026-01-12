import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useCampusStore } from "../store/useCampusStore";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useUserStore((s) => s.user);
  const campus = useCampusStore((s) => s.campus);
  const authLoading = useUserStore((s) => s.authLoading);
  const [isHydrated, setIsHydrated] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    // Mark as hydrated after first render to allow persisted stores to load from localStorage
    // Use a microtask to avoid synchronous setState within effect body
    const t = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // If auth is taking too long, mark timeout so we can fail-fast and avoid an infinite spinner
    if (!authLoading) return;
    const timeout = setTimeout(() => setTimedOut(true), 9000);
    return () => clearTimeout(timeout);
  }, [authLoading]);

  useEffect(() => {
    // If we timed out and there is no user, attempt a best-effort sign out to clear storage
    if (!timedOut) return;
    if (user) return;

    let cancelled = false;

    (async () => {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // Best-effort only; we don't crash here
        console.warn("ProtectedRoute: signOut during timeout failed", e);
      }
      if (!cancelled) {
        // nothing to do; redirect will happen via JSX below
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [timedOut, user]);

  // While auth is still loading, render a small spinner instead of redirecting to avoid redirect loops
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If we have decided auth has stalled/timed out, fail-safe to login
  if (timedOut && !user) {
    return <Navigate to="/auth/login" replace />;
  }

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
