"use client";

import { useMemo, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HabitCard } from "@/features/habits/components/HabitCard";
import { useHabits } from "@/features/habits/hooks/useHabits";
import { useHabitRealtime } from "@/features/habits/hooks/useHabitRealtime";
import { useQuestStore } from "@/stores/questStore";
import type { HabitWithStreak } from "@/types/app.types";

export default function HabitsPage() {
  const { habits, streaks, partnerCompletions, isLoading, handleComplete, handleUncomplete, isCompletedToday } = useHabits();
  useHabitRealtime();

  const habitsWithMeta = useMemo<HabitWithStreak[]>(() => habits.map((habit) => ({
    ...habit,
    streak: streaks[habit.id] ?? null,
    completedToday: isCompletedToday(habit.id),
    partnerCompletedToday: partnerCompletions[habit.id] ?? false,
  })), [habits, streaks, partnerCompletions, isCompletedToday]);

  const doneCount = useMemo(() => habitsWithMeta.filter((h) => h.completedToday).length, [habitsWithMeta]);
  const total = habitsWithMeta.length;

  const { quests, updateProgress } = useQuestStore();

  useEffect(() => {
    updateProgress("daily_habit_1", Math.min(doneCount, 1));
    updateProgress("daily_habit_3", doneCount);
  }, [doneCount, updateProgress]);

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Habits</h1>
          {total > 0 && (
            <p className="text-xs text-slate-500 mt-0.5">{doneCount}/{total} done today</p>
          )}
        </div>
        <Link href="/habits/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </Link>
      </div>

      {/* Quest progress indicator */}
      {total > 0 && (() => {
        const habitQuest = quests.find((q) => q.id === "daily_habit_3");
        if (!habitQuest || habitQuest.claimed) return null;
        return (
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-amber-500/20">
            <span className="text-sm">⚔️</span>
            <span className="text-xs text-slate-400 flex-1">Quest: Complete {habitQuest.target} habits</span>
            <span className="text-xs font-bold text-amber-400">{habitQuest.progress}/{habitQuest.target}</span>
          </div>
        );
      })()}

      {/* Progress bar */}
      {total > 0 && (
        <div className="glass rounded-2xl p-4">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Today&apos;s progress</span>
            <span>{Math.round((doneCount / total) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(doneCount / total) * 100}%`,
                background: "linear-gradient(to right, #10b981, #14b8a6)",
              }}
            />
          </div>
        </div>
      )}

      {/* Habit list */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
        </div>
      ) : habitsWithMeta.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-4xl mb-3">🌱</p>
          <p className="text-sm font-medium text-slate-300 mb-1">No habits yet</p>
          <p className="text-xs text-slate-500 mb-5">Build routines that grow with your partner.</p>
          <Link href="/habits/new">
            <Button size="sm">Add your first habit</Button>
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {habitsWithMeta.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={() =>
                habit.completedToday
                  ? handleUncomplete(habit.id)
                  : handleComplete(habit.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
