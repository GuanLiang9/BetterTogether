"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAchievementsStore } from "@/stores/achievementsStore";

export function AchievementToastLayer() {
  const pending = useAchievementsStore((s) => s.pendingAchievement);
  const clear = useAchievementsStore((s) => s.clearPendingAchievement);

  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(clear, 4000);
    return () => clearTimeout(t);
  }, [pending, clear]);

  return (
    <AnimatePresence>
      {pending && (
        <motion.div
          key={pending.id}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] w-[90vw] max-w-sm"
        >
          <div className="glass border border-white/15 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
            <span className="text-2xl">{pending.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-widest">
                Achievement Unlocked
              </p>
              <p className="text-sm font-bold text-slate-100 truncate">{pending.name}</p>
              <p className="text-xs text-slate-400 truncate">{pending.description}</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-xs text-emerald-400 font-bold">+{pending.xp_reward} XP</span>
              {pending.coin_reward > 0 && (
                <span className="text-xs text-amber-400 font-bold">+{pending.coin_reward} 🪙</span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
