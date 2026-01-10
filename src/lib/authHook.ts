import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { useCampusStore } from "../store/useCampusStore";

export const useAuthSession = () => {
  const [loading, setLoading] = useState(true);
  const initAttempted = useRef(false);

  const setUser = useUserStore((s) => s.setUser);
  const updateUser = useUserStore((s) => s.updateUser);
  const setAuthLoading = useUserStore((s) => s.setAuthLoading);
  const setCampus = useCampusStore((s) => s.setCampus);
  const clearCampus = useCampusStore((s) => s.clearCampus);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      // Only run initialization once
      if (initAttempted.current) return;
      initAttempted.current = true;

      try {
        console.log("🔐 [authHook] Starting auth initialization...");
        setAuthLoading(true);
        
        // Get current session asynchronously
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (!isMounted) return;
          
          console.log("🔐 [authHook] Session check complete", { hasSession: !!sessionData?.session });
          
          if (sessionError || !sessionData?.session?.user) {
            console.log("🔐 [authHook] No session found");
            setAuthLoading(false);
            setLoading(false);
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

          // Try to fetch campus and preferences from profiles table
          try {
            console.log("🔐 [authHook] Fetching profile and campus...");
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("campus_id, show_all_campuses")
              .eq("id", authUser.id)
              .single();

            if (!isMounted) return;

            if (!profileError) {
              // Set show_all_campuses in user store
              if (typeof profile.show_all_campuses !== "undefined") {
                updateUser({ show_all_campuses: !!profile.show_all_campuses });
              }

              if (profile?.campus_id) {
                // Fetch the full campus data including short_name
                const { data: campus } = await supabase
                  .from("campuses")
                  .select("id, name, short_name")
                  .eq("id", profile.campus_id)
                  .single();

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
            console.error("🔐 [authHook] Error fetching campus:", e);
          }
        } catch (sessionErr) {
          console.error("🔐 [authHook] Error getting session:", sessionErr);
        }
        
        // Auth initialization complete
        if (isMounted) {
          setAuthLoading(false);
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ [authHook] Auth init error:", err);
        if (isMounted) {
          setLoading(false);
          setAuthLoading(false);
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

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.fullname,
          });

          // Also restore campus and preferences on auth state change
          try {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("campus_id, show_all_campuses")
              .eq("id", session.user.id)
              .single();

            if (!isMounted) return;

            if (!profileError) {
              if (typeof profile.show_all_campuses !== "undefined") {
                updateUser({ show_all_campuses: !!profile.show_all_campuses });
              }

              if (profile?.campus_id) {
                const { data: campus } = await supabase
                  .from("campuses")
                  .select("id, name, short_name")
                  .eq("id", profile.campus_id)
                  .single();

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
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, updateUser, setAuthLoading, setCampus, clearCampus]);

  return { loading };
};
