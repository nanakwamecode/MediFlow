import { create } from "zustand";

interface AuthUser {
  id: string;
  username: string;
  displayName: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;

  /** Hydrate session from cookie on app load */
  checkSession: () => Promise<void>;

  /** Register a new account */
  register: (data: {
    username: string;
    password: string;
    displayName?: string;
  }) => Promise<boolean>;

  /** Log in with credentials */
  login: (data: { username: string; password: string }) => Promise<boolean>;

  /** Log out and clear session */
  logout: () => Promise<void>;

  /** Update signed-in display name (refreshes session cookie) */
  updateDisplayName: (displayName: string) => Promise<boolean>;

  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  isLoading: true, // start true — we check session on mount
  error: null,

  checkSession: async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const { user } = await res.json();
        set({ isLoggedIn: true, user, isLoading: false });
      } else {
        set({ isLoggedIn: false, user: null, isLoading: false });
      }
    } catch {
      set({ isLoggedIn: false, user: null, isLoading: false });
    }
  },

  register: async (data) => {
    set({ error: null, isLoading: true });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        set({ error: json.error, isLoading: false });
        return false;
      }

      set({ isLoggedIn: true, user: json.user, isLoading: false });
      return true;
    } catch {
      set({ error: "Network error. Please try again.", isLoading: false });
      return false;
    }
  },

  login: async (data) => {
    set({ error: null, isLoading: true });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        set({ error: json.error, isLoading: false });
        return false;
      }

      set({ isLoggedIn: true, user: json.user, isLoading: false });
      return true;
    } catch {
      set({ error: "Network error. Please try again.", isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // still clear local state even if request fails
    }
    set({ isLoggedIn: false, user: null, error: null });
  },

  updateDisplayName: async (displayName: string) => {
    set({ error: null });
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });
      const json = await res.json();

      if (!res.ok) {
        set({ error: json.error ?? "Could not update profile." });
        return false;
      }

      set({ user: json.user });
      return true;
    } catch {
      set({ error: "Network error. Please try again." });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
