"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X } from "lucide-react";
import { useGamificationStore } from "@/stores/gamificationStore";
import { getLevelTitle } from "@/lib/gamification/level-thresholds";
import { Button } from "@/components/ui/Button";

export function LevelUpModal() {
  const { pendingLevelUp, newLevel, clearLevelUp } = useGamificationStore();

  // Auto-close after 6 seconds
  useEffect(() => {
    if (!pendingLevelUp) return;
    const t = setTimeout(clearLevelUp, 6000);
    return () => clearTimeout(t);
  }, [pendingLevelUp, clearLevelUp]);

  return (
    <AnimatePresence>
      {pendingLevelUp && newLevel !== null && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm"
            onClick={clearLevelUp}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[401] max-w-sm mx-auto"
          >
            <div className="glass rounded-3xl p-8 text-center border border-emerald-500/20">
              <button
                onClick={clearLevelUp}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Celebration */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl mb-4"
              >
                🌟
              </motion.div>

              <p className="text-xs font-medium text-emerald-400 uppercase tracking-widest mb-2">
                Level up!
              </p>

              <h2 className="text-3xl font-bold gradient-text mb-1">
                Level {newLevel}
              </h2>

              <p className="text-sm text-slate-400 mb-6">
                {getLevelTitle(newLevel)}
              </p>

              {/* XP bar decorative */}
              <div className="h-1.5 bg-white/8 rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(to right, #10b981, #06b6d4)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                />
              </div>

              <Button onClick={clearLevelUp} className="w-full gap-2">
                <Zap className="h-4 w-4" />
                Keep growing!
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
