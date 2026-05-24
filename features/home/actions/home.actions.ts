"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getOrCreateHome(coupleId: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("couple_homes")
    .select("*")
    .eq("couple_id", coupleId)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("couple_homes")
    .insert({ couple_id: coupleId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getHomePlacements(coupleId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("home_placements")
    .select("*")
    .eq("couple_id", coupleId)
    .order("created_at");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function placeItem(
  coupleId: string,
  itemSlug: string,
  itemEmoji: string,
  itemLabel: string,
  gridX: number,
  gridY: number,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Remove any existing item at this cell first
  await supabase
    .from("home_placements")
    .delete()
    .eq("couple_id", coupleId)
    .eq("grid_x", gridX)
    .eq("grid_y", gridY);

  const { data, error } = await supabase
    .from("home_placements")
    .insert({
      couple_id: coupleId,
      item_slug: itemSlug,
      item_emoji: itemEmoji,
      item_label: itemLabel,
      placed_by: user.id,
      grid_x: gridX,
      grid_y: gridY,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/home");
  return data;
}

export async function removeItem(placementId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_placements")
    .delete()
    .eq("id", placementId);

  if (error) throw new Error(error.message);
  revalidatePath("/home");
}

export async function updateBackground(coupleId: string, background: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("couple_homes")
    .update({ background, updated_at: new Date().toISOString() })
    .eq("couple_id", coupleId);

  if (error) throw new Error(error.message);
  revalidatePath("/home");
}
