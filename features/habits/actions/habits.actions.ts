"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const HabitSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  icon: z.string().optional().default("🎯"),
  color: z.string().default("#10b981"),
  frequency: z.enum(["daily", "weekdays", "custom"]).default("daily"),
  frequency_days: z.array(z.number()).optional(),
  is_shared: z.boolean().default(false),
  xp_reward: z.number().default(15),
  coin_reward: z.number().default(3),
});

export type HabitFormValues = z.infer<typeof HabitSchema>;

export async function createHabit(formData: HabitFormValues) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = HabitSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.message };

  let couple_id: string | null = null;
  if (parsed.data.is_shared) {
    const { data: profile } = await supabase
      .from("profiles").select("couple_id").eq("id", user.id)
      .returns<{ couple_id: string | null }[]>().single();
    couple_id = profile?.couple_id ?? null;
    if (!couple_id) return { error: "You need a partner to create shared habits" };
  }

  const { data, error } = await supabase
    .from("habits")
    .insert({ owner_id: user.id, couple_id, ...parsed.data })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/habits");
  return { data };
}

export async function updateHabit(habitId: string, formData: Partial<HabitFormValues>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("habits")
    .update(formData)
    .eq("id", habitId)
    .eq("owner_id", user.id)
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/habits");
  revalidatePath(`/habits/${habitId}`);
  return { data };
}

export async function archiveHabit(habitId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("habits")
    .update({ archived: true })
    .eq("id", habitId)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/habits");
  return { success: true };
}

export async function completeHabit(habitId: string, date: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("habit_completions").insert({
    habit_id: habitId,
    user_id: user.id,
    completed_date: date,
  });

  // 23505 = unique_violation (already completed today) — not an error
  if (error && error.code !== "23505") return { error: error.message };
  return { success: true };
}

export async function uncompleteHabit(habitId: string, date: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("habit_completions")
    .delete()
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
    .eq("completed_date", date);

  if (error) return { error: error.message };
  return { success: true };
}
