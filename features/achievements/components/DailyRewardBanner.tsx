"use client";

import { useState, useEffect, memo } from "react";
import { Gift, Loader2, X } from "lucide-react";
import { useAchievementsStore } from "@/stores/achievementsStore";
import { useGamificationStore } from "@/stores/gamificationStore";
import { claimDailyReward, getTodayReward } from "@/features/achievements/actions/achievements.actions";

export const DailyRewardBanner = memo(function DailyRewardBanner() {
  // Selective field selectors — only re-renders when these specific fields change
  const dailyRewardClaimed = useAchievementsStore((s) => s.dailyRewardClaimed);
  const dailyRewardStreak = useAchievementsStore((s) => s.dailyRewardStreak);
  const setDailyRewardClaimed = useAchievementsStore((s) => s.setDailyRewardClaimed);
  const triggerXpGain = useGamificationStore((s) => s.triggerXpGain);
  const triggerCoinGain = useGamificationStore((s) => s.triggerCoinGain);

  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [justClaimed, setJustClaimed] = useState<{ xp: number; coins: number } | null>(null);

  useEffect(() => {
    if (checked) return;
    setChecked(true);
    getTodayReward().then((reward) => {
      if (reward) setDailyRewardClaimed(true, reward.streak_day);
    });
  }, [checked, setDailyRewardClaimed]);

  async function handleClaim() {
    setLoading(true);
    try {
      const result = await claimDailyReward();
      if (!result.alreadyClaimed) {
        const { xp_earned, coins_earned, streak_day } = result.reward;
        setDailyRewardClaimed(true, streak_day);
        setJustClaimed({ xp: xp_earned, coins: coins_earned });
        triggerXpGain(xp_earned);
        triggerCoinGain(coins_earned);
        setTimeout(() => setJustClaimed(null), 3000);
      } else {
        setDailyRewardClaimed(true, result.reward.streak_day);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!checked || dismissed) return null;
  if (dailyRewardClaimed && !justClaimed) return null;

  return (
    <div className="relative rounded-2xl border border-amber-400/25 bg-amber-400/8 px-4 py-3 flex items-center gap-3 animate-fade-in">
      <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/20 flex items-center justify-center shrink-0">
        <Gift className="w-5 h-5 text-amber-400" />
      </div>

      <div className="flex-1 min-w-0">
        {justClaimed ? (
          <>
            <p className="text-sm font-bold text-amber-300">Daily reward claimed!</p>
            <p className="text-xs text-slate-400">
              +{justClaimed.xp} XP · +{justClaimed.coins} 🪙 · Day {dailyRewardStreak}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-bold text-slate-200">Daily Reward</p>
            <p className="text-xs text-slate-400">
              Day {dailyRewardStreak} streak — log in every day for bigger rewards
            </p>
          </>
        )}
      </div>

      {!dailyRewardClaimed && (
        <button
          onClick={handleClaim}
          disabled={loading}
          className="shrink-0 px-3 py-1.5 rounded-full bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition-all disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Claim"}
        </button>
      )}

      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-0.5 rounded-full hover:bg-white/10 transition-colors"
      >
        <X className="w-3 h-3 text-slate-500" />
      </button>
    </div>
  );
});
