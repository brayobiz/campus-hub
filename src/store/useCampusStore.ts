import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Campus {
  name: string;
  // add other fields if needed
}

interface CampusStore {
  campus: Campus | null;
  setCampus: (campus: Campus) => void;
  clearCampus: () => void;
}

export const useCampusStore = create<CampusStore>()(
  persist(
    (set) => ({
      campus: null,
      setCampus: (campus) => set({ campus }),
      clearCampus: () => set({ campus: null }),
    }),
    {
      name: "campus-store",
    }
  )
);
