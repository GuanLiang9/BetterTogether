"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAchievements() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("condition_value");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getUserAchievements(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_achievements")
    .select("*, achievement:achievements(*)")
    .eq("user_id", userId)
    .order("unlocked_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function claimDailyReward() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const today = new Date().toISOString().split("T")[0];

  // Check already claimed
  const { data: existing } = await supabase
    .from("daily_rewards")
    .select("*")
    .eq("user_id", user.id)
    .eq("reward_date", today)
    .maybeSingle();

  if (existing) return { alreadyClaimed: true, reward: existing };

  // Calculate streak day
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const { data: lastReward } = await supabase
    .from("daily_rewards")
    .select("streak_day, reward_date")
    .eq("user_id", user.id)
    .order("reward_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const streakDay = lastReward?.reward_date === yesterdayStr
    ? (lastReward.streak_day ?? 0) + 1
    : 1;

  // Reward scale: bigger on milestone days
  const xpEarned = streakDay >= 30 ? 100 :
                   streakDay >= 14 ? 60 :
                   streakDay >= 7  ? 40 :
                   streakDay >= 3  ? 20 : 10;
  const coinsEarned = Math.floor(xpEarned / 5);

  const { data, error } = await supabase
    .from("daily_rewards")
    .insert({
      user_id: user.id,
      reward_date: today,
      streak_day: streakDay,
      xp_earned: xpEarned,
      coins_earned: coinsEarned,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Award XP/coins via the existing ledger function if available,
  // otherwise update profile directly
  await supabase.rpc("award_xp_and_coins", {
    p_user_id: user.id,
    p_xp: xpEarned,
    p_coins: coinsEarned,
    p_reason: `Daily login reward (day ${streakDay})`,
    p_source_id: data.id,
  }).throwOnError();

  return { alreadyClaimed: false, reward: data };
}

export async function getTodayReward() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("daily_rewards")
    .select("*")
    .eq("user_id", user.id)
    .eq("reward_date", today)
    .maybeSingle();

  return data;
}
