"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGamificationStore } from "@/stores/gamificationStore";

export function CoinDisplay() {
  const coins = useGamificationStore((s) => s.coins);
  const [displayed, setDisplayed] = useState(coins);
  const prevRef = useRef(coins);

  useEffect(() => {
    if (prevRef.current === coins) return;
    prevRef.current = coins;
    setDisplayed(coins);
  }, [coins]);

  return (
    <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5 border border-amber-500/20">
      <AnimatePresence mode="wait">
        <motion.span
          key={displayed}
          initial={{ scale: 1.4, y: -4 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="text-sm leading-none"
        >
          🪙
        </motion.span>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.span
          key={`v-${displayed}`}
          initial={{ scale: 1.25, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="text-sm font-bold text-amber-400 tabular-nums"
        >
          {displayed.toLocaleString("en-SG")}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
