"use client";

import { useState, useEffect } from "react";
import { Flame, Timer, CalendarDays, Heart, ShoppingBag, Zap, Flame as StreakIcon, Home, Trophy, Sparkles } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CountdownBanner } from "@/features/calendar/components/CountdownBanner";
import { DailyRewardBanner } from "@/features/achievements/components/DailyRewardBanner";
import { QuestPanel } from "@/features/quests/components/QuestPanel";
import { CharacterCard } from "@/features/character/components/CharacterCard";
import { useAuthStore } from "@/stores/authStore";
import { useGamificationStore } from "@/stores/gamificationStore";
import { useCoupleStore } from "@/stores/coupleStore";
import { useCharacterStore } from "@/stores/characterStore";
import { getLevelTitle, getXpForLevel } from "@/lib/gamification/level-thresholds";

export default function DashboardPage() {
  const profile = useAuthStore((s) => s.profile);
  const { xpToNextLevel } = useGamificationStore();
  const couple = useCoupleStore((s) => s.couple);
  const partner = useCoupleStore((s) => s.partner);

  const [greeting, setGreeting] = useState("Good morning 🌿");
  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon ☀️");
    else if (h >= 17) setGreeting("Good evening 🌙");
  }, []);

  const characterConfig = useCharacterStore((s) => s.config);

  const level = profile?.level ?? 1;
  const totalXp = profile?.xp ?? 0;
  const levelXpStart = getXpForLevel(level);
  const levelXpEnd = getXpForLevel(level + 1);
  const xpBandWidth = xpToNextLevel || (levelXpEnd - levelXpStart);
  const xpInLevel = Math.max(0, totalXp - levelXpStart);
  const xpProgress = xpBandWidth > 0 ? (xpInLevel / xpBandWidth) * 100 : 0;

  const coupleStreak = couple?.couple_streak ?? 0;
  const isLinked = !!partner;


  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {/* Header with character */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">{greeting}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {profile?.display_name
              ? `Welcome back, ${profile.display_name.split(" ")[0]}`
              : "Keep growing together."}
          </p>
        </div>
        <Link href="/character">
          <CharacterCard config={characterConfig} size="sm" />
        </Link>
      </div>

      {/* XP / Level hero card */}
      <Card className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              {getLevelTitle(level)}
            </p>
            <p className="text-xl font-bold gradient-text">Level {level}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {isLinked && coupleStreak > 0 && (
              <div className="flex items-center gap-1 text-xs text-orange-400">
                <StreakIcon className="h-3.5 w-3.5" />
                <span className="font-bold">{coupleStreak}d streak</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <Zap className="h-3.5 w-3.5" />
              <span className="font-medium">{totalXp.toLocaleString("en-SG")} XP</span>
            </div>
          </div>
        </div>

        {/* XP progress bar */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
            <span>{xpInLevel.toLocaleString("en-SG")} / {xpBandWidth.toLocaleString("en-SG")} XP</span>
            <span>→ Level {level + 1}</span>
          </div>
          <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, xpProgress)}%`,
                background: "linear-gradient(to right, #10b981, #06b6d4)",
              }}
            />
          </div>
        </div>
      </Card>

      {/* Daily reward */}
      <DailyRewardBanner />

      {/* Daily quests */}
      <QuestPanel />

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/habits">
          <Card hover className="flex flex-col gap-2 p-4">
            <Flame className="h-5 w-5 text-orange-400" />
            <span className="text-sm font-medium text-slate-200">Habits</span>
            <span className="text-xs text-slate-500">Track your day</span>
          </Card>
        </Link>
        <Link href="/focus">
          <Card hover className="flex flex-col gap-2 p-4">
            <Timer className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-medium text-slate-200">Focus</span>
            <span className="text-xs text-slate-500">Lock in together</span>
          </Card>
        </Link>
        <Link href="/calendar">
          <Card hover className="flex flex-col gap-2 p-4">
            <CalendarDays className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-medium text-slate-200">Calendar</span>
            <span className="text-xs text-slate-500">Shared events</span>
          </Card>
        </Link>
        <Link href="/partner">
          <Card hover className="flex flex-col gap-2 p-4">
            <Heart className="h-5 w-5 text-pink-400" />
            <span className="text-sm font-medium text-slate-200">Partner</span>
            <span className="text-xs text-slate-500">See their progress</span>
          </Card>
        </Link>
        <Link href="/home">
          <Card hover className="flex flex-col gap-2 p-4">
            <Home className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-medium text-slate-200">Our Home</span>
            <span className="text-xs text-slate-500">Build together</span>
          </Card>
        </Link>
        <Link href="/achievements">
          <Card hover className="flex flex-col gap-2 p-4">
            <Trophy className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-medium text-slate-200">Achievements</span>
            <span className="text-xs text-slate-500">Your milestones</span>
          </Card>
        </Link>
      </div>

      {/* Character + Shop row */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/character">
          <Card hover className="flex items-center gap-3 p-4">
            <div className="h-9 w-9 rounded-xl bg-purple-500/15 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200">Character</p>
              <p className="text-xs text-slate-500">Customise</p>
            </div>
          </Card>
        </Link>
        <Link href="/shop">
          <Card hover className="flex items-center gap-3 p-4">
            <div className="h-9 w-9 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
              <ShoppingBag className="h-4 w-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200">Shop</p>
              <div className="flex items-center gap-1 text-xs text-amber-400">
                <span>🪙</span>
                <span className="font-bold">{(profile?.coins ?? 0).toLocaleString("en-SG")}</span>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Next event countdown */}
      <CountdownBanner />
    </div>
  );
}
