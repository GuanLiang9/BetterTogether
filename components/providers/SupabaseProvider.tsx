"use client";

import { createContext, useContext, useRef, useEffect, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type SupabaseContextType = SupabaseClient<Database>;

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error("useSupabase must be used within SupabaseProvider");
  return ctx;
}

async function fetchAndSetProfile(
  supabase: SupabaseContextType,
  userId: string,
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (profile) useAuthStore.getState().setProfile(profile);
}

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabase = useRef(createClient()).current;

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Single source of truth: onAuthStateChange fires immediately with the
    // current session so we don't need a separate getSession() call.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const { setUser, clearAuth } = useAuthStore.getState();
        if (session?.user) {
          setUser(session.user);
          // Fetch profile on sign-in or token refresh; skip on every other event
          // to avoid redundant round-trips (e.g. USER_UPDATED fires after the
          // profile Postgres-Changes listener already updated the store).
          if (
            event === "SIGNED_IN" ||
            event === "INITIAL_SESSION" ||
            event === "TOKEN_REFRESHED"
          ) {
            await fetchAndSetProfile(supabase, session.user.id);
          }
        } else {
          clearAuth();
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}
