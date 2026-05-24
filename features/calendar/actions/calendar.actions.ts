"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const EventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  emoji: z.string().optional(),
  starts_at: z.string(), // ISO UTC
  ends_at: z.string().optional(),
  all_day: z.boolean().default(false),
  color: z.string().default("#10b981"),
  location: z.string().optional(),
});

export type EventFormValues = z.infer<typeof EventSchema>;

async function getCoupleId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from("profiles").select("couple_id").eq("id", userId)
    .returns<{ couple_id: string | null }[]>().single();
  return data?.couple_id ?? null;
}

export async function createEvent(
  formData: EventFormValues,
  reminderMins?: number | null,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = EventSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.message };

  const coupleId = await getCoupleId(supabase, user.id);
  if (!coupleId) return { error: "No partner linked — events are shared with your couple" };

  const { data: event, error } = await supabase
    .from("events")
    .insert({ ...parsed.data, couple_id: coupleId, created_by: user.id })
    .select()
    .single();

  if (error) return { error: error.message };

  // Create reminder if requested
  if (reminderMins != null && event) {
    const remindAt = new Date(
      new Date(parsed.data.starts_at).getTime() - reminderMins * 60 * 1000,
    ).toISOString();

    // Get both partner user IDs for the couple
    const { data: members } = await supabase
      .from("profiles")
      .select("id")
      .eq("couple_id", coupleId)
      .returns<{ id: string }[]>();

    const targetIds = (members ?? []).map((m) => m.id);
    if (targetIds.length > 0) {
      await supabase.from("reminders").insert({
        event_id: event.id,
        remind_at: remindAt,
        target_user_ids: targetIds,
      });
    }
  }

  revalidatePath("/calendar");
  return { data: event };
}

export async function updateEvent(eventId: string, formData: Partial<EventFormValues>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const coupleId = await getCoupleId(supabase, user.id);
  if (!coupleId) return { error: "Not in a couple" };

  const { data, error } = await supabase
    .from("events")
    .update(formData)
    .eq("id", eventId)
    .eq("couple_id", coupleId)
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/calendar");
  return { data };
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const coupleId = await getCoupleId(supabase, user.id);
  if (!coupleId) return { error: "Not in a couple" };

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("couple_id", coupleId);

  if (error) return { error: error.message };
  revalidatePath("/calendar");
  return { success: true };
}
