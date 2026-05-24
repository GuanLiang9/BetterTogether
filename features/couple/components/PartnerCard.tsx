"use client";

import { useCoupleStore } from "@/stores/coupleStore";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Flame, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LEVEL_TITLES, getXpForLevel } from "@/lib/gamification/level-thresholds";

export function PartnerCard() {
  const { partner, partnerOnline, couple } = useCoupleStore();

  if (!partner) return null;

  const level = partner.level;
  const title = LEVEL_TITLES[level] ?? "Cosmos";
  const xpForThisLevel = getXpForLevel(level);
  const xpForNextLevel = getXpForLevel(level + 1);
  const xpProgress = partner.xp - xpForThisLevel;
  const xpNeeded = xpForNextLevel - xpForThisLevel;

  return (
    <Card glow className="p-5 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center gap-4">
        <Avatar
          src={partner.avatar_url}
          name={partner.display_name}
          size="lg"
          online={partnerOnline}
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-100 truncate">{partner.display_name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="emerald">Lv.{level} {title}</Badge>
            {partnerOnline && (
              <Badge variant="cyan">Online</Badge>
            )}
          </div>
        </div>
      </div>

      {/* XP bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-emerald-400" />{partner.xp} XP</span>
          <span>{xpProgress}/{xpNeeded} to next level</span>
        </div>
        <ProgressBar value={xpProgress} max={xpNeeded} />
      </div>

      {/* Couple streak */}
      {couple && couple.couple_streak > 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-orange-500/10 border border-orange-500/20 px-3 py-2">
          <Flame className="h-4 w-4 text-orange-400" />
          <span className="text-sm text-orange-300 font-medium">
            {couple.couple_streak}-day couple streak
          </span>
        </div>
      )}
    </Card>
  );
}
