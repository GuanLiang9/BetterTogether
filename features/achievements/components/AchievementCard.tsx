"use client";

import { Trophy } from "lucide-react";
import { CATEGORY_COLORS } from "@/types/achievement.types";
import type { Achievement, UserAchievement } from "@/types/achievement.types";
import { cn } from "@/lib/utils/cn";

interface AchievementCardProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
}

export function AchievementCard({ achievement, userAchievement }: AchievementCardProps) {
  const unlocked = !!userAchievement;
  const colorClass = CATEGORY_COLORS[achievement.category] ?? CATEGORY_COLORS.special;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-2xl border transition-all",
        unlocked
          ? "border-white/12 bg-white/5"
          : "border-white/6 bg-white/2 opacity-60",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center text-xl border shrink-0",
          unlocked ? colorClass : "bg-white/5 border-white/8 text-slate-600",
        )}
      >
        {unlocked ? achievement.icon : <Trophy className="w-4 h-4 text-slate-600" />}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold", unlocked ? "text-slate-100" : "text-slate-500")}>
          {achievement.name}
        </p>
        <p className="text-xs text-slate-500 leading-tight">{achievement.description}</p>
        {unlocked && userAchievement && (
          <p className="text-[10px] text-slate-600 mt-0.5">
            {new Date(userAchievement.unlocked_at).toLocaleDateString("en-SG", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Rewards */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[10px] text-emerald-400 font-medium">+{achievement.xp_reward} XP</span>
        {achievement.coin_reward > 0 && (
          <span className="text-[10px] text-amber-400 font-medium">+{achievement.coin_reward} 🪙</span>
        )}
        {unlocked && <span className="text-[10px] text-emerald-500 font-bold">✓</span>}
      </div>
    </div>
  );
}
