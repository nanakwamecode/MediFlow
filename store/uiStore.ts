import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NavKey } from "@/lib/constants";

interface UiState {
  sidebarCollapsed: boolean;
  activePage: NavKey;
  viewingPatientId: string | null;
  toggleSidebar: () => void;
  setActivePage: (page: NavKey) => void;
  viewPatient: (id: string) => void;
  clearViewingPatient: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      activePage: "dashboard",
      viewingPatientId: null,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setActivePage: (page) =>
        set({ activePage: page, viewingPatientId: null }),
      viewPatient: (id) =>
        set({ viewingPatientId: id, activePage: "patients" }),
      clearViewingPatient: () => set({ viewingPatientId: null }),
    }),
    {
      name: "ui-storage",
    }
  )
);
