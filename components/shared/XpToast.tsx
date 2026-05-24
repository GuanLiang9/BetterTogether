"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useGamificationStore } from "@/stores/gamificationStore";

export function XpToastLayer() {
  const { pendingXpGain, pendingCoinGain, clearPendingXpGain, clearPendingCoinGain } = useGamificationStore();

  useEffect(() => {
    if (pendingXpGain === null) return;
    const t = setTimeout(clearPendingXpGain, 2200);
    return () => clearTimeout(t);
  }, [pendingXpGain, clearPendingXpGain]);

  useEffect(() => {
    if (pendingCoinGain === null) return;
    const t = setTimeout(clearPendingCoinGain, 2200);
    return () => clearTimeout(t);
  }, [pendingCoinGain, clearPendingCoinGain]);

  return (
    <div className="pointer-events-none fixed bottom-28 right-4 z-[201] flex flex-col items-end gap-2">
      <AnimatePresence>
        {pendingXpGain !== null && (
          <motion.div
            key={`xp-${pendingXpGain}`}
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5 border border-emerald-500/20"
          >
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">+{pendingXpGain} XP</span>
          </motion.div>
        )}
        {pendingCoinGain !== null && (
          <motion.div
            key={`coins-${pendingCoinGain}`}
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 28, delay: 0.08 }}
            className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5 border border-amber-500/20"
          >
            <span className="text-sm">🪙</span>
            <span className="text-sm font-bold text-amber-400">+{pendingCoinGain}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
