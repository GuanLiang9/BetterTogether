"use client";

import { useState } from "react";
import { useCouple } from "../hooks/useCouple";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

const REACTIONS = [
  { emoji: "💚", label: "Love" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "⭐", label: "Star" },
  { emoji: "🌿", label: "Grow" },
  { emoji: "💪", label: "Strong" },
  { emoji: "🎉", label: "Celebrate" },
  { emoji: "😊", label: "Smile" },
  { emoji: "🥰", label: "Adore" },
];

export function ReactionPanel() {
  const { sendReaction } = useCouple();
  const [lastSent, setLastSent] = useState<string | null>(null);

  async function handleReaction(emoji: string) {
    await sendReaction(emoji);
    setLastSent(emoji);
    setTimeout(() => setLastSent(null), 1000);
  }

  return (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Send a reaction</p>
      <div className="grid grid-cols-4 gap-2">
        {REACTIONS.map(({ emoji, label }) => (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            title={label}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl p-3 transition-all duration-150",
              "bg-white/5 hover:bg-white/10 active:scale-90",
              lastSent === emoji && "bg-emerald-500/20 scale-110",
            )}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-[10px] text-slate-600">{label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
