"use client";
import { Trophy } from "lucide-react";
import { useQuests } from "../hooks/useQuests";
import { QuestCard } from "./QuestCard";

export function AchievementPanel() {
  const { achievements, claimReward } = useQuests();
  const unclaimedComplete = achievements.filter((a) => a.completed && !a.claimed);
  const inProgress = achievements.filter((a) => !a.completed);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-amber-400" />
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Achievements</p>
      </div>
      {unclaimedComplete.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-medium">Ready to claim!</p>
          {unclaimedComplete.map((a) => <QuestCard key={a.id} quest={a} onClaim={claimReward} />)}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {inProgress.slice(0, 5).map((a) => <QuestCard key={a.id} quest={a} onClaim={claimReward} />)}
      </div>
    </div>
  );
}
