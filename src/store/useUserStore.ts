// store/useUserStore.ts
import { create } from "zustand";

export interface UserProfile {
  id?: string | null;        // auth user id (supabase)
  email?: string | null;
  name?: string | null;
  verified?: boolean;
}

type UserState = {
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  updateUser: (patch: Partial<UserProfile>) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  updateUser: (patch) =>
    set((state) => ({ user: { ...(state.user ?? {}), ...patch } })),
  clearUser: () => set({ user: null }),
}));