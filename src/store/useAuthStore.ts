import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabaseClient";

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  year?: string;
  major?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionToken: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, fullname: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      sessionToken: null,

      setUser: (user) =>
        set({ user, isAuthenticated: user !== null }),

      setError: (error) => set({ error }),

      setLoading: (isLoading) => set({ isLoading }),

      clearError: () => set({ error: null }),

      // Login with email and password
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log("🔐 [AuthStore] Logging in:", email);
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error("❌ [AuthStore] Login error:", error.message);
            set({ error: error.message, isLoading: false });
            return false;
          }

          if (!data?.user) {
            set({ error: "No user data returned", isLoading: false });
            return false;
          }

          // Fetch full profile from database
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (profileError) {
            console.warn("⚠️ [AuthStore] Profile fetch error:", profileError);
          }

          const user: User = {
            id: data.user.id,
            email: data.user.email,
            name: profileData?.name || data.user.user_metadata?.fullname,
            avatar_url: profileData?.avatar_url,
            year: profileData?.year,
            major: profileData?.major,
          };

          set({
            user,
            isAuthenticated: true,
            sessionToken: data.session?.access_token || null,
            isLoading: false,
            error: null,
          });

          console.log("✅ [AuthStore] Login successful:", user.id);
          return true;
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : "Login failed";
          console.error("❌ [AuthStore] Unexpected login error:", err);
          set({ error: errorMsg, isLoading: false });
          return false;
        }
      },

      // Signup with email, password, and fullname
      signup: async (email: string, password: string, fullname: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log("🔐 [AuthStore] Signing up:", email);
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { fullname },
              emailRedirectTo: `${window.location.origin}/auth/campuspicker`,
            },
          });

          if (error) {
            console.error("❌ [AuthStore] Signup error:", error.message);
            set({ error: error.message, isLoading: false });
            return false;
          }

          if (!data?.user?.id) {
            set({ error: "No user returned from signup", isLoading: false });
            return false;
          }

          // Create profile in database
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              email,
              name: fullname,
              created_at: new Date().toISOString(),
            });

          if (profileError) {
            console.warn("⚠️ [AuthStore] Profile creation error:", profileError);
          }

          const user: User = {
            id: data.user.id,
            email,
            name: fullname,
          };

          set({
            user,
            isAuthenticated: false, // Not confirmed yet
            isLoading: false,
            error: null,
          });

          console.log("✅ [AuthStore] Signup successful");
          return true;
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : "Signup failed";
          console.error("❌ [AuthStore] Unexpected signup error:", err);
          set({ error: errorMsg, isLoading: false });
          return false;
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true });
        try {
          console.log("🔐 [AuthStore] Logging out");
          
          const { error } = await supabase.auth.signOut();
          
          if (error) {
            console.error("❌ [AuthStore] Logout error:", error.message);
          }

          set({
            user: null,
            isAuthenticated: false,
            sessionToken: null,
            isLoading: false,
            error: null,
          });

          console.log("✅ [AuthStore] Logout successful");
        } catch (err) {
          console.error("❌ [AuthStore] Logout error:", err);
          set({ isLoading: false });
        }
      },

      // Update user profile
      updateProfile: async (updates: Partial<User>) => {
        const { user: currentUser } = get();
        if (!currentUser?.id) {
          set({ error: "No user logged in" });
          return false;
        }

        set({ isLoading: true });
        try {
          console.log("🔐 [AuthStore] Updating profile");
          
          const { error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", currentUser.id);

          if (error) {
            console.error("❌ [AuthStore] Update error:", error.message);
            set({ error: error.message, isLoading: false });
            return false;
          }

          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser, isLoading: false });
          
          console.log("✅ [AuthStore] Profile updated");
          return true;
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : "Update failed";
          console.error("❌ [AuthStore] Update error:", err);
          set({ error: errorMsg, isLoading: false });
          return false;
        }
      },

      // Refresh session
      refreshSession: async () => {
        try {
          console.log("🔐 [AuthStore] Refreshing session");
          
          const { data, error } = await supabase.auth.refreshSession();

          if (error || !data?.user) {
            console.error("❌ [AuthStore] Session refresh failed");
            set({ isAuthenticated: false, user: null });
            return false;
          }

          // Fetch updated profile
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          const user: User = {
            id: data.user.id,
            email: data.user.email,
            name: profileData?.name,
            avatar_url: profileData?.avatar_url,
            year: profileData?.year,
            major: profileData?.major,
          };

          set({
            user,
            isAuthenticated: true,
            sessionToken: data.session?.access_token || null,
          });

          console.log("✅ [AuthStore] Session refreshed");
          return true;
        } catch (err) {
          console.error("❌ [AuthStore] Session refresh error:", err);
          return false;
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sessionToken: state.sessionToken,
      }),
    }
  )
);
