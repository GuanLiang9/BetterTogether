"use client";
import { Sword } from "lucide-react";
import { QuestPanel } from "@/features/quests/components/QuestPanel";
import { AchievementPanel } from "@/features/quests/components/AchievementPanel";

export default function QuestsPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      <div className="flex items-center gap-2">
        <Sword className="h-5 w-5 text-amber-400" />
        <h1 className="text-2xl font-bold text-slate-100">Quests</h1>
      </div>
      <QuestPanel />
      <AchievementPanel />
    </div>
  );
}
