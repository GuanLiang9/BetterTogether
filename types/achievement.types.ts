export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: "habit" | "focus" | "couple" | "streak" | "special";
  xp_reward: number;
  coin_reward: number;
  condition_type: string;
  condition_value: number;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement;
}

export interface DailyReward {
  id: string;
  user_id: string;
  reward_date: string;
  streak_day: number;
  xp_earned: number;
  coins_earned: number;
  claimed_at: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  habit:   "Habits",
  focus:   "Focus",
  couple:  "Couple",
  streak:  "Streaks",
  special: "Special",
};

export const CATEGORY_COLORS: Record<string, string> = {
  habit:   "text-orange-400 bg-orange-400/10 border-orange-400/20",
  focus:   "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  couple:  "text-pink-400 bg-pink-400/10 border-pink-400/20",
  streak:  "text-amber-400 bg-amber-400/10 border-amber-400/20",
  special: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
};
