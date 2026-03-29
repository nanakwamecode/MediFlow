import { create } from "zustand";
import type { AuthCredentials } from "@/types";

interface AuthState {
  isLoggedIn: boolean;
  user: AuthCredentials | null;
  login: (user: AuthCredentials) => void;
  register: (user: AuthCredentials) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (user) => set({ isLoggedIn: true, user }),
  register: (user) => set({ isLoggedIn: true, user }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));
