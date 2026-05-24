"use client";

import { useEffect, useRef } from "react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { useAuthStore } from "@/stores/authStore";
import { useHabitsStore } from "@/stores/habitsStore";
import { useGamificationStore } from "@/stores/gamificationStore";

export function useHabitRealtime() {
  const supabase = useSupabase();
  const profile = useAuthStore((s) => s.profile);
  const habits = useHabitsStore((s) => s.habits);
  const setPartnerCompletion = useHabitsStore((s) => s.setPartnerCompletion);
  const { triggerXpGain } = useGamificationStore();

  // Keep shared habit IDs in a ref so the channel doesn't rebuild on every habits change
  const sharedIdsRef = useRef<string[]>([]);
  sharedIdsRef.current = habits
    .filter((h) => h.is_shared && h.couple_id === profile?.couple_id)
    .map((h) => h.id);

  useEffect(() => {
    if (!profile?.couple_id || !profile?.id) return;

    const channel = supabase
      .channel(`habit-realtime:${profile.couple_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "habit_completions",
          filter: `user_id=neq.${profile.id}`,
        },
        (payload) => {
          const record = payload.new as { habit_id: string; user_id: string };
          if (sharedIdsRef.current.includes(record.habit_id)) {
            setPartnerCompletion(record.habit_id, true);
            triggerXpGain(5);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "habit_completions",
          filter: `user_id=neq.${profile.id}`,
        },
        (payload) => {
          const record = payload.old as { habit_id: string };
          if (sharedIdsRef.current.includes(record.habit_id)) {
            setPartnerCompletion(record.habit_id, false);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile?.couple_id, profile?.id, supabase, setPartnerCompletion, triggerXpGain]);
}
