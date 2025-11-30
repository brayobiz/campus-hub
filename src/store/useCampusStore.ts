import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCampusStore = create(
  persist(
    (set) => ({
      campus: null,
      setCampus: (campus) => set({ campus }),
      clearCampus: () => set({ campus: null }),
    }),
    {
      name: "campus-store", // localStorage key
    }
  )
);