import { create } from "zustand";
import { persist } from "zustand/middleware";

export const THEME_IDS = ["default", "midnight", "rose", "ocean", "amber", "neon", "lavender", "crimson"] as const;
export type ThemeId = typeof THEME_IDS[number];

interface ThemeStore {
  activeTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      activeTheme: "default",
      setTheme: (activeTheme) => set({ activeTheme }),
    }),
    { name: "theme-store" },
  ),
);
