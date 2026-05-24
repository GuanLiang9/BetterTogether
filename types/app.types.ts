import type { Database } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type CoupleLink = Database["public"]["Tables"]["couple_links"]["Row"];
export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitCompletion = Database["public"]["Tables"]["habit_completions"]["Row"];
export type HabitStreak = Database["public"]["Tables"]["habit_streaks"]["Row"];
export type FocusSession = Database["public"]["Tables"]["focus_sessions"]["Row"];
export type CoupleFocusSession = Database["public"]["Tables"]["couple_focus_sessions"]["Row"];
export type CalendarEvent = Database["public"]["Tables"]["events"]["Row"];
export type Reminder = Database["public"]["Tables"]["reminders"]["Row"];
export type Unlockable = Database["public"]["Tables"]["unlockables"]["Row"];
export type UserUnlockable = Database["public"]["Tables"]["user_unlockables"]["Row"];
export type XpLedgerEntry = Database["public"]["Tables"]["xp_ledger"]["Row"];

export type HabitWithStreak = Habit & {
  streak: HabitStreak | null;
  completedToday: boolean;
  partnerCompletedToday?: boolean;
};

export type ReactionEvent = {
  id: string;
  emoji: string;
  fromUserId: string;
  fromDisplayName: string;
  timestamp: number;
};
