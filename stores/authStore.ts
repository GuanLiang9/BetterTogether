import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/app.types";

interface AuthStore {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  updateProfile: (partial: Partial<Profile>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setProfile: (profile) => set({ profile }),
  updateProfile: (partial) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...partial } : null,
    })),
  clearAuth: () => set({ user: null, profile: null, isLoading: false }),
}));
