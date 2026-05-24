import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuestType = "daily" | "achievement";
export type QuestModule = "habits" | "focus" | "calendar" | "general" | "couple";

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  xpReward: number;
  coinReward: number;
  type: QuestType;
  module: QuestModule;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
}

interface QuestStore {
  quests: Quest[];
  dailyResetDate: string; // "yyyy-MM-dd"
  totalQuestsCompleted: number;
  initQuests: (quests: Quest[]) => void;
  updateProgress: (questId: string, progress: number) => void;
  completeQuest: (questId: string) => void;
  claimQuest: (questId: string) => void;
  resetDailyQuests: (newDate: string, dailyQuests: Quest[]) => void;
  setDailyResetDate: (date: string) => void;
}

export const useQuestStore = create<QuestStore>()(
  persist(
    (set) => ({
      quests: [],
      dailyResetDate: "",
      totalQuestsCompleted: 0,
      initQuests: (quests) => set({ quests }),
      updateProgress: (questId, progress) =>
        set((state) => ({
          quests: state.quests.map((q) =>
            q.id === questId
              ? { ...q, progress: Math.min(progress, q.target), completed: progress >= q.target }
              : q
          ),
        })),
      completeQuest: (questId) =>
        set((state) => ({
          quests: state.quests.map((q) =>
            q.id === questId ? { ...q, progress: q.target, completed: true } : q
          ),
        })),
      claimQuest: (questId) =>
        set((state) => ({
          quests: state.quests.map((q) =>
            q.id === questId ? { ...q, claimed: true } : q
          ),
          totalQuestsCompleted: state.totalQuestsCompleted + 1,
        })),
      resetDailyQuests: (newDate, dailyQuests) =>
        set((state) => ({
          dailyResetDate: newDate,
          quests: [
            ...dailyQuests,
            ...state.quests.filter((q) => q.type === "achievement"),
          ],
        })),
      setDailyResetDate: (dailyResetDate) => set({ dailyResetDate }),
    }),
    { name: "quest-store" }
  )
);
