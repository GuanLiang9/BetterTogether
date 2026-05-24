"use client";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import type { ThemeId } from "@/stores/themeStore";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const profileTheme = useAuthStore((s) => s.profile?.active_theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  // Sync profile theme → local store when profile loads
  useEffect(() => {
    if (profileTheme && profileTheme !== activeTheme) {
      setTheme(profileTheme as ThemeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileTheme]);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeTheme);
    document.body.style.background = "var(--app-bg)";
  }, [activeTheme]);

  return <>{children}</>;
}
