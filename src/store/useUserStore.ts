// store/useUserStore.ts
import { create } from "zustand";

export interface UserProfile {
  id?: string | null;        // auth user id (supabase)
  email?: string | null;
  name?: string | null;
  verified?: boolean;
  campus_id?: string | null;
  avatar_url?: string | null;
}

type UserState = {
  user: UserProfile | null;
  authLoading: boolean;
  setUser: (u: UserProfile | null) => void;
  updateUser: (patch: Partial<UserProfile>) => void;
  clearUser: () => void;
  setAuthLoading: (loading: boolean) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  authLoading: false,
  setUser: (u) => set({ user: u }),
  updateUser: (patch) =>
    set((state) => ({ user: { ...(state.user ?? {}), ...patch } })),
  clearUser: () => set({ user: null }),
  setAuthLoading: (loading) => set({ authLoading: loading }),
}));