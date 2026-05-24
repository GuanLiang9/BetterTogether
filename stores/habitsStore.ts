import { create } from "zustand";
import type { Habit, HabitCompletion, HabitStreak } from "@/types/app.types";

interface HabitsStore {
  habits: Habit[];
  completions: Record<string, HabitCompletion[]>;
  streaks: Record<string, HabitStreak>;
  partnerCompletions: Record<string, boolean>;
  isLoading: boolean;
  hydratedForId: string | null;
  setHabits: (habits: Habit[]) => void;
  setCompletions: (completions: HabitCompletion[]) => void;
  setStreaks: (streaks: HabitStreak[]) => void;
  markComplete: (habitId: string, completion: HabitCompletion) => void;
  markIncomplete: (habitId: string, date: string) => void;
  setPartnerCompletion: (habitId: string, done: boolean) => void;
  updateStreak: (habitId: string, streak: HabitStreak) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (habitId: string, partial: Partial<Habit>) => void;
  removeHabit: (habitId: string) => void;
  setLoading: (loading: boolean) => void;
  setHydratedForId: (id: string) => void;
}

export const useHabitsStore = create<HabitsStore>((set) => ({
  habits: [],
  completions: {},
  streaks: {},
  partnerCompletions: {},
  isLoading: false,
  hydratedForId: null,
  setHabits: (habits) => set({ habits }),
  setCompletions: (completions) =>
    set({
      completions: completions.reduce<Record<string, HabitCompletion[]>>((acc, c) => {
        if (!acc[c.habit_id]) acc[c.habit_id] = [];
        acc[c.habit_id].push(c);
        return acc;
      }, {}),
    }),
  setStreaks: (streaks) =>
    set({
      streaks: streaks.reduce<Record<string, HabitStreak>>((acc, s) => {
        acc[s.habit_id] = s;
        return acc;
      }, {}),
    }),
  markComplete: (habitId, completion) =>
    set((state) => ({
      completions: {
        ...state.completions,
        [habitId]: [...(state.completions[habitId] ?? []), completion],
      },
    })),
  markIncomplete: (habitId, date) =>
    set((state) => ({
      completions: {
        ...state.completions,
        [habitId]: (state.completions[habitId] ?? []).filter(
          (c) => c.completed_date !== date,
        ),
      },
    })),
  setPartnerCompletion: (habitId, done) =>
    set((state) => ({ partnerCompletions: { ...state.partnerCompletions, [habitId]: done } })),
  updateStreak: (habitId, streak) =>
    set((state) => ({ streaks: { ...state.streaks, [habitId]: streak } })),
  addHabit: (habit) => set((state) => ({ habits: [habit, ...state.habits] })),
  updateHabit: (habitId, partial) =>
    set((state) => ({
      habits: state.habits.map((h) => (h.id === habitId ? { ...h, ...partial } : h)),
    })),
  removeHabit: (habitId) =>
    set((state) => ({ habits: state.habits.filter((h) => h.id !== habitId) })),
  setLoading: (isLoading) => set({ isLoading }),
  setHydratedForId: (id) => set({ hydratedForId: id }),
}));
