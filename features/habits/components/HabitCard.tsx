"use client";

import { memo } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { HabitCheckbox } from "./HabitCheckbox";
import type { HabitWithStreak } from "@/types/app.types";

interface HabitCardProps {
  habit: HabitWithStreak;
  onToggle: () => void;
}

export const HabitCard = memo(function HabitCard({ habit, onToggle }: HabitCardProps) {
  const streak = habit.streak?.current_streak ?? 0;

  return (
    <Card className={`p-4 transition-opacity duration-300 ${habit.completedToday ? "opacity-80" : ""}`}>
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: `${habit.color}22` }}
        >
          {habit.icon ?? "✅"}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/habits/${habit.id}`} className="block">
            <p className={`font-semibold truncate transition-colors ${habit.completedToday ? "text-slate-400 line-through decoration-slate-600" : "text-slate-100"}`}>
              {habit.title}
            </p>
          </Link>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {streak > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-orange-400 font-medium">
                <Flame className="h-3 w-3" />
                {streak}d
              </span>
            )}
            <span className="text-xs text-emerald-600">+{habit.xp_reward} XP</span>
            {habit.is_shared && (
              <span className="text-xs text-slate-600">👫</span>
            )}
            {habit.is_shared && habit.partnerCompletedToday && (
              <span className="text-xs text-pink-400 font-medium">partner ✓</span>
            )}
          </div>
        </div>

        {/* Checkbox */}
        <HabitCheckbox
          checked={habit.completedToday}
          onChange={onToggle}
          color={habit.color}
        />
      </div>
    </Card>
  );
});
