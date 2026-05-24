"use client";

import { useEffect, useCallback } from "react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { useAuthStore } from "@/stores/authStore";
import { useHabitsStore } from "@/stores/habitsStore";
import { useGamificationStore } from "@/stores/gamificationStore";
import { completeHabit, uncompleteHabit } from "../actions/habits.actions";
import { format, subDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";

function getTodayInTz(timezone?: string | null) {
  if (!timezone) return format(new Date(), "yyyy-MM-dd");
  return format(toZonedTime(new Date(), timezone), "yyyy-MM-dd");
}

function get90DaysAgo() {
  return format(subDays(new Date(), 90), "yyyy-MM-dd");
}

export function useHabits() {
  const supabase = useSupabase();
  const profile = useAuthStore((s) => s.profile);
  const {
    habits, completions, streaks, partnerCompletions, isLoading,
    setHabits, setCompletions, setStreaks, markComplete, markIncomplete, setLoading, setHydratedForId,
  } = useHabitsStore();
  const { triggerXpGain, triggerCoinGain } = useGamificationStore();

  const today = getTodayInTz(profile?.timezone);

  useEffect(() => {
    if (!profile?.id) return;
    // Skip if already loaded for this user — realtime keeps data fresh after initial load
    if (useHabitsStore.getState().hydratedForId === profile.id) return;
    setHydratedForId(profile.id);
    setLoading(true);

    Promise.all([
      supabase.from("habits").select("*")
        .eq("owner_id", profile.id).eq("archived", false)
        .order("created_at", { ascending: false }),
      supabase.from("habit_completions").select("*")
        .eq("user_id", profile.id).gte("completed_date", get90DaysAgo()),
      supabase.from("habit_streaks").select("*").eq("user_id", profile.id),
    ]).then(([habitsRes, completionsRes, streaksRes]) => {
      if (habitsRes.data) setHabits(habitsRes.data);
      if (completionsRes.data) setCompletions(completionsRes.data);
      if (streaksRes.data) setStreaks(streaksRes.data);
      setLoading(false);
    });
  }, [profile?.id, supabase, setHabits, setCompletions, setStreaks, setLoading, setHydratedForId]);

  const handleComplete = useCallback(async (habitId: string) => {
    if (!profile?.id) return;
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const optimisticCompletion = {
      id: `optimistic-${Date.now()}`,
      habit_id: habitId,
      user_id: profile.id,
      completed_date: today,
      completed_at: new Date().toISOString(),
    };
    markComplete(habitId, optimisticCompletion);
    triggerXpGain(habit.xp_reward);
    triggerCoinGain(habit.coin_reward);

    const result = await completeHabit(habitId, today);
    if (result?.error) {
      markIncomplete(habitId, today);
    }
  }, [profile?.id, habits, today, markComplete, markIncomplete, triggerXpGain, triggerCoinGain]);

  const handleUncomplete = useCallback(async (habitId: string) => {
    if (!profile?.id) return;
    markIncomplete(habitId, today);
    const result = await uncompleteHabit(habitId, today);
    if (result?.error) {
      // Re-fetch to restore correct state on failure
      const { data } = await supabase.from("habit_completions").select("*")
        .eq("user_id", profile.id).gte("completed_date", get90DaysAgo());
      if (data) setCompletions(data);
    }
  }, [profile?.id, today, markIncomplete, supabase, setCompletions]);

  const isCompletedToday = useCallback((habitId: string) => {
    return (completions[habitId] ?? []).some((c) => c.completed_date === today);
  }, [completions, today]);

  return {
    habits, completions, streaks, partnerCompletions, isLoading, today,
    handleComplete, handleUncomplete, isCompletedToday,
  };
}
