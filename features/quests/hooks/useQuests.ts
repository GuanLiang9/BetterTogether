"use client";
import { useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useQuestStore } from "@/stores/questStore";
import { useHabitsStore } from "@/stores/habitsStore";
import { useFocusStore } from "@/stores/focusStore";
import { useAuthStore } from "@/stores/authStore";
import { useGamificationStore } from "@/stores/gamificationStore";
import { makeDailyQuests, makeAchievements } from "@/lib/quests/definitions";

export function useQuests() {
  const { quests, dailyResetDate, initQuests, updateProgress, claimQuest, resetDailyQuests, completeQuest } = useQuestStore();

  // Initialize quests on first load / daily reset
  useEffect(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    if (dailyResetDate !== today) {
      const daily = makeDailyQuests();
      const existing = useQuestStore.getState().quests;
      if (existing.length === 0) {
        // First time — init everything
        initQuests([...daily, ...makeAchievements()]);
      } else {
        resetDailyQuests(today, daily);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-complete daily_login on mount
  useEffect(() => {
    const loginQuest = useQuestStore.getState().quests.find((q) => q.id === "daily_login");
    if (loginQuest && !loginQuest.completed) {
      completeQuest("daily_login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync achievement progress from stores
  useEffect(() => {
    const habitsState = useHabitsStore.getState();
    const focusState = useFocusStore.getState();
    const profile = useAuthStore.getState().profile;

    // Count total habit completions across all habits
    const totalHabitCompletions = Object.values(habitsState.completions).reduce((sum, arr) => sum + arr.length, 0);

    // Max streak across all habits
    const maxStreak = Object.values(habitsState.streaks).reduce((max, s) => Math.max(max, s.current_streak ?? 0), 0);

    // Focus sessions from history
    const totalFocusSessions = focusState.sessionHistory?.length ?? 0;

    const updates: { id: string; progress: number }[] = [
      { id: "ach_habits_1", progress: totalHabitCompletions },
      { id: "ach_habits_10", progress: totalHabitCompletions },
      { id: "ach_habits_50", progress: totalHabitCompletions },
      { id: "ach_habits_100", progress: totalHabitCompletions },
      { id: "ach_streak_3", progress: maxStreak },
      { id: "ach_streak_7", progress: maxStreak },
      { id: "ach_streak_30", progress: maxStreak },
      { id: "ach_focus_1", progress: totalFocusSessions },
      { id: "ach_focus_10", progress: totalFocusSessions },
      { id: "ach_focus_50", progress: totalFocusSessions },
      { id: "ach_level_5", progress: profile?.level ?? 0 },
      { id: "ach_level_10", progress: profile?.level ?? 0 },
    ];

    updates.forEach(({ id, progress }) => {
      const quest = useQuestStore.getState().quests.find((q) => q.id === id);
      if (quest && !quest.claimed) {
        updateProgress(id, progress);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const claimReward = useCallback((questId: string) => {
    const quest = useQuestStore.getState().quests.find((q) => q.id === questId);
    if (!quest || quest.claimed || !quest.completed) return;
    claimQuest(questId);
    const gStore = useGamificationStore.getState();
    if (quest.xpReward > 0) gStore.triggerXpGain(quest.xpReward);
    if (quest.coinReward > 0) gStore.triggerCoinGain(quest.coinReward);
  }, [claimQuest]);

  // Also export a function to update daily habit progress — called externally
  const updateDailyHabitProgress = useCallback((count: number) => {
    updateProgress("daily_habit_1", Math.min(count, 1));
    updateProgress("daily_habit_3", count);
  }, [updateProgress]);

  const updateDailyFocusProgress = useCallback(() => {
    updateProgress("daily_focus", 1);
  }, [updateProgress]);

  const dailyQuests = quests.filter((q) => q.type === "daily");
  const achievements = quests.filter((q) => q.type === "achievement");

  return { dailyQuests, achievements, claimReward, updateDailyHabitProgress, updateDailyFocusProgress };
}
