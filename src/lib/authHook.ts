import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabaseClient";
import { withTimeout } from "./promiseUtils";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { useCampusStore } from "../store/useCampusStore";

/**
 * useAuthSession
 * - Ensures auth bootstrap cannot hang indefinitely by applying timeouts
 * - Guarantees auth/loading state is cleared in all code paths (finally)
 * - Clears Supabase auth storage on invalid session and attempts a signOut
 */
export const useAuthSession = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const initAttempted = useRef(false);

  const setUser = useUserStore((s) => s.setUser);
  const updateUser = useUserStore((s) => s.updateUser);
  const setAuthLoading = useUserStore((s) => s.setAuthLoading);
  const setCampus = useCampusStore((s) => s.setCampus);
  const clearCampus = useCampusStore((s) => s.clearCampus);

  useEffect(() => {
    let isMounted = true;

    const safeSignOut = async () => {
      try {
        // Clear auth storage on the client and attempt to sign out (with timeout)
        await withTimeout(supabase.auth.signOut(), 9000, "signOut timed out");
      } catch (e) {
        // Best-effort: if signOut fails, we still clear local user state below
        console.warn("🔐 [authHook] signOut failed or timed out:", e);
      } finally {
        if (isMounted) {
          setUser(null);
          clearCampus();
        }
      }
    };

    const initAuth = async () => {
      // Only run initialization once
      if (initAttempted.current) return;
      initAttempted.current = true;

      setError(null);
      setAuthLoading(true);

      try {
        console.log("🔐 [authHook] Starting auth initialization...");

        // Use a hard timeout so a hung network call can't keep the app spinning
        const sessionResult = await withTimeout(
          supabase.auth.getSession(),
          9000,
          "getSession timed out"
        );

        const sessionData = (sessionResult as any)?.data ?? null;
        const sessionError = (sessionResult as any)?.error ?? null;

        if (!isMounted) return;

        console.log("🔐 [authHook] Session check complete", { hasSession: !!sessionData?.session });

        if (sessionError || !sessionData?.session?.user) {
          // No valid session: ensure storage is cleared and stop loading.
          console.log("🔐 [authHook] No session found or error during getSession");
          await safeSignOut();
          return;
        }

        const authUser = sessionData.session.user;
        console.log("🔐 [authHook] User session found:", authUser.id);

        // Set user in store
        if (isMounted) {
          setUser({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.fullname,
          });
        }

        // Try to fetch campus and preferences from profiles table (with timeout)
        try {
          console.log("🔐 [authHook] Fetching profile and campus...");

          const profileResult = await withTimeout(
            supabase
              .from("profiles")
              .select("campus_id, show_all_campuses")
              .eq("id", authUser.id)
              .single(),
            9000,
            "profile fetch timed out"
          );

          const profile = (profileResult as any)?.data ?? null;
          const profileError = (profileResult as any)?.error ?? null;

          if (!isMounted) return;

          if (!profileError && profile) {
            // Set show_all_campuses in user store
            if (typeof profile.show_all_campuses !== "undefined") {
              updateUser({ show_all_campuses: !!profile.show_all_campuses });
            }

            if (profile?.campus_id) {
              const campusResult = await withTimeout(
                supabase
                  .from("campuses")
                  .select("id, name, short_name")
                  .eq("id", profile.campus_id)
                  .single(),
                9000,
                "campus fetch timed out"
              );

              const campus = (campusResult as any)?.data ?? null;

              if (campus && isMounted) {
                console.log("🔐 [authHook] Campus restored:", campus.name);
                setCampus({
                  id: campus.id,
                  name: campus.name,
                  short_name: campus.short_name,
                });
              }
            } else {
              console.log("🔐 [authHook] Profile found but no campus_id set");
            }
          }
        } catch (e) {
          console.error("🔐 [authHook] Error fetching campus or profile:", e);
        }
      } catch (err: any) {
        console.error("❌ [authHook] Auth init error:", err);
        setError(err instanceof Error ? err : new Error(String(err)));

        // If session fetch errored, attempt to sign out and clear storage
        try {
          await withTimeout(supabase.auth.signOut(), 9000, "signOut timed out");
        } catch (e) {
          console.warn("🔐 [authHook] signOut during error handling failed:", e);
        }
      } finally {
        // Always clear loading flags so the UI can make a deterministic decision
        if (isMounted) {
          setAuthLoading(false);
          setLoading(false);
        }
      }
    };

    initAuth();

    // Set up auth state listener
    console.log("🔐 [authHook] Setting up auth state listener...");
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        console.log("🔐 [authHook] Auth state changed:", event);
        if (!isMounted) return;

        try {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.fullname,
            });

            // Also restore campus and preferences on auth state change
            try {
              const profileResult = await withTimeout(
                supabase
                  .from("profiles")
                  .select("campus_id, show_all_campuses")
                  .eq("id", session.user.id)
                  .single(),
                9000,
                "profile fetch timed out"
              );

              const profile = (profileResult as any)?.data ?? null;
              const profileError = (profileResult as any)?.error ?? null;

              if (!isMounted) return;

              if (!profileError && profile) {
                if (typeof profile.show_all_campuses !== "undefined") {
                  updateUser({ show_all_campuses: !!profile.show_all_campuses });
                }

                if (profile?.campus_id) {
                  const campusResult = await withTimeout(
                    supabase
                      .from("campuses")
                      .select("id, name, short_name")
                      .eq("id", profile.campus_id)
                      .single(),
                    9000,
                    "campus fetch timed out"
                  );

                  const campus = (campusResult as any)?.data ?? null;

                  if (campus && isMounted) {
                    setCampus({
                      id: campus.id,
                      name: campus.name,
                      short_name: campus.short_name,
                    });
                  }
                }
              }
            } catch (e) {
              console.error("Error restoring campus on auth change:", e);
            }
          } else {
            console.log("🔐 [authHook] User logged out");
            if (isMounted) {
              setUser(null);
              clearCampus();
            }
          }
        } catch (e) {
          console.error("🔐 [authHook] Error in auth state change handler:", e);
        }
      }
    );

    return () => {
      isMounted = false;
      // Ensure we unsubscribe the listener on unmount
      try {
        authListener?.subscription.unsubscribe();
      } catch (e) {
        console.warn("🔐 [authHook] Failed to unsubscribe auth listener:", e);
      }
    };
  }, [setUser, updateUser, setAuthLoading, setCampus, clearCampus]);

  return { loading, error };
};
