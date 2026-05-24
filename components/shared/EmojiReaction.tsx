"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoupleStore } from "@/stores/coupleStore";

export function EmojiReactionLayer() {
  const { pendingReactions, removeReaction } = useCoupleStore();

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      <AnimatePresence>
        {pendingReactions.map((reaction) => (
          <FloatingEmoji
            key={reaction.id}
            id={reaction.id}
            emoji={reaction.emoji}
            onDone={() => removeReaction(reaction.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function FloatingEmoji({ id, emoji, onDone }: { id: string; emoji: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [id, onDone]);

  const startX = 30 + Math.random() * 40; // 30–70% from left

  return (
    <motion.div
      className="absolute bottom-24 text-4xl select-none"
      style={{ left: `${startX}%` }}
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 1, 0], y: -220, scale: [0.5, 1.2, 1, 0.8] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.2, ease: "easeOut" }}
    >
      {emoji}
    </motion.div>
  );
}
