// src/stores/userStore.ts
import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";

// inline types (instead of types.ts)
export type ModelProfile = {
  id: number;
  user_id: number;
  name: string;
  age: number;
  genre: "Male" | "Female" | "Other";
  height: number;
  location: string;
  category: "Hostess" | "Model" | "Photographer" | "Promoter" | "Waiter" | "Other";
  description: string;
  video_portfolio?: string;
  created_at: string;
};

export type AgencyProfile = {
  id: number;
  agency_id: number;
  name: string;
  operating_years: number;
  no_of_employees: number;
  location: string;
  professional_bio: string;
  website?: string;
};

type UserProfile = ModelProfile | AgencyProfile;

type UserState = {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  clearProfile: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    const { user, token } = useAuthStore.getState();
    if (!user) return;

    set({ loading: true, error: null });

    try {
      const url =
        user.role === "model"
          ? `/api/models/${user.id}`
          : `/api/agencies/${user.id}`;

      const res = await axios.get<UserProfile>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ profile: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch profile", loading: false });
    }
  },

  clearProfile: () => set({ profile: null }),
}));
