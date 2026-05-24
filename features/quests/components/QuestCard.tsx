"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { Quest } from "@/stores/questStore";

interface QuestCardProps {
  quest: Quest;
  onClaim: (id: string) => void;
}

export function QuestCard({ quest, onClaim }: QuestCardProps) {
  const pct = Math.min(100, (quest.progress / quest.target) * 100);
  const canClaim = quest.completed && !quest.claimed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: quest.claimed ? 0.4 : 1, x: 0 }}
      className={cn(
        "glass rounded-2xl p-4 flex flex-col gap-2.5 border",
        quest.claimed ? "border-white/4" : quest.completed ? "border-emerald-500/30" : "border-white/8",
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-lg",
          quest.claimed ? "bg-white/5" : quest.completed ? "bg-emerald-500/15" : "bg-white/8",
        )}>
          {quest.claimed ? "✓" : quest.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={cn("text-sm font-semibold", quest.claimed ? "text-slate-600" : "text-slate-200")}>
              {quest.title}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              {quest.xpReward > 0 && (
                <span className="text-[10px] font-medium text-emerald-400">+{quest.xpReward} XP</span>
              )}
              {quest.coinReward > 0 && (
                <span className="text-[10px] font-medium text-amber-400">🪙 {quest.coinReward}</span>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{quest.description}</p>
        </div>
      </div>

      {/* Progress */}
      {quest.target > 1 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, var(--app-accent-from), var(--app-accent-to))" }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-[10px] text-slate-500 tabular-nums">{quest.progress}/{quest.target}</span>
        </div>
      )}

      {/* Claim button */}
      {canClaim && (
        <motion.button
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onClaim(quest.id)}
          className="w-full rounded-xl py-2 text-xs font-bold text-white"
          style={{ background: "linear-gradient(to right, var(--app-accent-from), var(--app-accent-to))" }}
        >
          Claim Reward ✨
        </motion.button>
      )}
      {quest.claimed && (
        <p className="text-center text-[10px] text-slate-600">Claimed</p>
      )}
    </motion.div>
  );
}
