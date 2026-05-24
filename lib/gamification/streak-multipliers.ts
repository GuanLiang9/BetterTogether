export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 90) return 2.0;
  if (streakDays >= 60) return 1.75;
  if (streakDays >= 30) return 1.5;
  if (streakDays >= 14) return 1.25;
  if (streakDays >= 7) return 1.15;
  return 1.0;
}

export function applyMultiplier(baseXp: number, streakDays: number): number {
  return Math.round(baseXp * getStreakMultiplier(streakDays));
}
