import { create } from "zustand";

interface ModalState {
  postOpen: boolean;
  openPost: () => void;
  closePost: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  postOpen: false,
  openPost: () => set({ postOpen: true }),
  closePost: () => set({ postOpen: false }),
}));

export default useModalStore;
