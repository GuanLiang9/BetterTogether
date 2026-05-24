import type { Quest } from "@/stores/questStore";

// Daily quests — reset every day
export const DAILY_QUEST_TEMPLATES: Omit<Quest, "progress" | "completed" | "claimed">[] = [
  { id: "daily_login", title: "Daily Check-in", description: "Open the app today", icon: "👋", xpReward: 10, coinReward: 5, type: "daily", module: "general", target: 1 },
  { id: "daily_habit_1", title: "First Step", description: "Complete any habit today", icon: "✅", xpReward: 25, coinReward: 10, type: "daily", module: "habits", target: 1 },
  { id: "daily_habit_3", title: "Habit Hat-trick", description: "Complete 3 habits today", icon: "🔥", xpReward: 75, coinReward: 30, type: "daily", module: "habits", target: 3 },
  { id: "daily_focus", title: "Deep Work", description: "Complete a focus session", icon: "🎯", xpReward: 50, coinReward: 20, type: "daily", module: "focus", target: 1 },
];

// Achievements — one-time, tracked by total stats
export const ACHIEVEMENT_TEMPLATES: Omit<Quest, "progress" | "completed" | "claimed">[] = [
  { id: "ach_habits_1", title: "First Habit", description: "Complete your very first habit", icon: "🌱", xpReward: 50, coinReward: 25, type: "achievement", module: "habits", target: 1 },
  { id: "ach_habits_10", title: "Habit Builder", description: "Complete 10 habits total", icon: "💪", xpReward: 100, coinReward: 50, type: "achievement", module: "habits", target: 10 },
  { id: "ach_habits_50", title: "Habit Master", description: "Complete 50 habits total", icon: "🏅", xpReward: 250, coinReward: 100, type: "achievement", module: "habits", target: 50 },
  { id: "ach_habits_100", title: "Habit Legend", description: "Complete 100 habits total", icon: "🏆", xpReward: 500, coinReward: 250, type: "achievement", module: "habits", target: 100 },
  { id: "ach_streak_3", title: "3-Day Streak", description: "Maintain a 3-day habit streak", icon: "🔥", xpReward: 100, coinReward: 50, type: "achievement", module: "habits", target: 3 },
  { id: "ach_streak_7", title: "Week Warrior", description: "Maintain a 7-day habit streak", icon: "⚡", xpReward: 300, coinReward: 150, type: "achievement", module: "habits", target: 7 },
  { id: "ach_streak_30", title: "Unstoppable", description: "Maintain a 30-day habit streak", icon: "💎", xpReward: 1000, coinReward: 500, type: "achievement", module: "habits", target: 30 },
  { id: "ach_focus_1", title: "First Session", description: "Complete your first focus session", icon: "🎋", xpReward: 75, coinReward: 25, type: "achievement", module: "focus", target: 1 },
  { id: "ach_focus_10", title: "Focus Regular", description: "Complete 10 focus sessions", icon: "🧘", xpReward: 200, coinReward: 100, type: "achievement", module: "focus", target: 10 },
  { id: "ach_focus_50", title: "Focus Master", description: "Complete 50 focus sessions", icon: "🌳", xpReward: 500, coinReward: 250, type: "achievement", module: "focus", target: 50 },
  { id: "ach_level_5", title: "Rising Star", description: "Reach Level 5", icon: "⭐", xpReward: 200, coinReward: 100, type: "achievement", module: "general", target: 5 },
  { id: "ach_level_10", title: "Veteran", description: "Reach Level 10", icon: "🌟", xpReward: 500, coinReward: 250, type: "achievement", module: "general", target: 10 },
];

export function makeDailyQuests(): Quest[] {
  return DAILY_QUEST_TEMPLATES.map((t) => ({ ...t, progress: 0, completed: false, claimed: false }));
}

export function makeAchievements(): Quest[] {
  return ACHIEVEMENT_TEMPLATES.map((t) => ({ ...t, progress: 0, completed: false, claimed: false }));
}
