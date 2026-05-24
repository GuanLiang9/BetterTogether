"use server";

import { createClient } from "@/lib/supabase/server";

export async function startFocusSession({
  durationMins,
  mode,
  coupleSessionId,
}: {
  durationMins: number;
  mode: "pomodoro" | "freeform";
  coupleSessionId?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles").select("couple_id").eq("id", user.id)
    .returns<{ couple_id: string | null }[]>().single();

  const { data, error } = await supabase
    .from("focus_sessions")
    .insert({
      user_id: user.id,
      couple_id: profile?.couple_id ?? null,
      duration_mins: durationMins,
      mode,
      status: "active",
      plant_stage: 0,
      xp_earned: 0,
      coins_earned: 0,
      couple_session_id: coupleSessionId ?? null,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function endFocusSession({
  sessionId,
  actualMins,
  plantStage,
  completed,
}: {
  sessionId: string;
  actualMins: number;
  plantStage: number;
  completed: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("focus_sessions")
    .update({
      status: completed ? "completed" : "abandoned",
      actual_mins: actualMins,
      plant_stage: plantStage,
      ended_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function createCoupleSession(durationMins: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles").select("couple_id").eq("id", user.id)
    .returns<{ couple_id: string | null }[]>().single();
  if (!profile?.couple_id) return { error: "No partner linked" };

  const { data, error } = await supabase
    .from("couple_focus_sessions")
    .insert({
      couple_id: profile.couple_id,
      initiated_by: user.id,
      duration_mins: durationMins,
      status: "waiting",
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function joinCoupleSession(coupleSessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("couple_focus_sessions")
    .update({ status: "active", started_at: new Date().toISOString() })
    .eq("id", coupleSessionId)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function getFocusHistory() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from("focus_sessions")
    .select("started_at, actual_mins, status, mode")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .gte("started_at", sevenDaysAgo)
    .order("started_at", { ascending: true });

  return data ?? [];
}
