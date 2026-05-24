"use client";
import { AnimatePresence } from "framer-motion";
import { Sword } from "lucide-react";
import { useQuests } from "../hooks/useQuests";
import { QuestCard } from "./QuestCard";

export function QuestPanel() {
  const { dailyQuests, claimReward } = useQuests();
  const claimedCount = dailyQuests.filter((q) => q.claimed).length;
  const completedCount = dailyQuests.filter((q) => q.completed).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sword className="h-4 w-4 text-amber-400" />
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Daily Quests</p>
        </div>
        <p className="text-xs text-slate-500">{completedCount}/{dailyQuests.length} done</p>
      </div>
      <AnimatePresence initial={false}>
        {dailyQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} onClaim={claimReward} />
        ))}
      </AnimatePresence>
    </div>
  );
}
