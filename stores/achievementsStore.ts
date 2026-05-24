import { create } from "zustand";
import type { Achievement, UserAchievement } from "@/types/achievement.types";

interface AchievementsStore {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  pendingAchievement: Achievement | null;
  dailyRewardClaimed: boolean;
  dailyRewardStreak: number;
  hydratedForId: string | null;
  setAchievements: (achievements: Achievement[]) => void;
  setUserAchievements: (userAchievements: UserAchievement[]) => void;
  addUserAchievement: (ua: UserAchievement) => void;
  triggerAchievement: (achievement: Achievement) => void;
  clearPendingAchievement: () => void;
  setDailyRewardClaimed: (claimed: boolean, streak?: number) => void;
  setHydratedForId: (id: string) => void;
}

export const useAchievementsStore = create<AchievementsStore>((set) => ({
  achievements: [],
  userAchievements: [],
  pendingAchievement: null,
  dailyRewardClaimed: false,
  dailyRewardStreak: 1,
  hydratedForId: null,
  setAchievements: (achievements) => set({ achievements }),
  setUserAchievements: (userAchievements) => set({ userAchievements }),
  addUserAchievement: (ua) =>
    set((state) => ({
      userAchievements: state.userAchievements.some((u) => u.id === ua.id)
        ? state.userAchievements
        : [...state.userAchievements, ua],
    })),
  triggerAchievement: (achievement) => set({ pendingAchievement: achievement }),
  clearPendingAchievement: () => set({ pendingAchievement: null }),
  setDailyRewardClaimed: (dailyRewardClaimed, streak = 1) =>
    set({ dailyRewardClaimed, dailyRewardStreak: streak }),
  setHydratedForId: (id) => set({ hydratedForId: id }),
}));
