// src/stores/authStore.ts
import { create } from "zustand";

type User = {
  id: number;
  name: string;
  email: string;
  role: "model" | "agency"; // strict type
};

type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}));
