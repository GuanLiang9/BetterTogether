"use client";

import { memo } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useGamificationStore } from "@/stores/gamificationStore";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getXpForLevel } from "@/lib/gamification/level-thresholds";
import { Coins, Zap } from "lucide-react";
import Link from "next/link";

export const TopBar = memo(function TopBar() {
  const level = useAuthStore((s) => s.profile?.level ?? 1);
  const xp = useAuthStore((s) => s.profile?.xp ?? 0);
  const coins = useAuthStore((s) => s.profile?.coins ?? 0);
  const avatarUrl = useAuthStore((s) => s.profile?.avatar_url ?? undefined);
  const displayName = useAuthStore((s) => s.profile?.display_name ?? undefined);
  const xpToNextLevel = useGamificationStore((s) => s.xpToNextLevel);

  const levelXpStart = getXpForLevel(level);
  const levelXpEnd = getXpForLevel(level + 1);
  const xpBand = xpToNextLevel || (levelXpEnd - levelXpStart);
  const xpDisplay = Math.max(0, xp - levelXpStart);

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/8 px-4 py-3">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        {/* Avatar */}
        <Link href="/settings/profile">
          <Avatar
            src={avatarUrl}
            name={displayName}
            size="sm"
          />
        </Link>

        {/* XP area */}
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              Lv.{level}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-amber-400">
                <Coins className="h-3.5 w-3.5" />
                {coins.toLocaleString("en-SG")}
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <Zap className="h-3.5 w-3.5" />
                {xp.toLocaleString("en-SG")} XP
              </span>
            </div>
          </div>
          <ProgressBar
            value={xpDisplay}
            max={xpBand}
            className="h-1.5"
          />
        </div>
      </div>
    </header>
  );
});
