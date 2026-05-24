"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function purchaseUnlockable(unlockableId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase.rpc("purchase_unlockable", {
    p_unlockable_id: unlockableId,
  });

  if (error) return { error: error.message };

  const result = data as { ok?: boolean; error?: string };
  if (result?.error) return { error: result.error };

  revalidatePath("/shop");
  return { ok: true };
}

export async function equipUnlockable(unlockableId: string, category: string, slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Unequip all same-category items first
  type UnlockableCategory = "theme" | "plant_skin" | "badge" | "reaction" | "couple_frame" | "sound";

  const { data: sameCategory } = await supabase
    .from("unlockables")
    .select("id")
    .eq("category", category as UnlockableCategory);

  const categoryIds = (sameCategory ?? []).map((i) => i.id);

  if (categoryIds.length > 0) {
    await supabase
      .from("user_unlockables")
      .update({ equipped: false })
      .eq("user_id", user.id)
      .in("unlockable_id", categoryIds);
  }

  const { error } = await supabase
    .from("user_unlockables")
    .update({ equipped: true })
    .eq("user_id", user.id)
    .eq("unlockable_id", unlockableId);

  if (error) return { error: error.message };

  if (category === "theme") {
    await supabase.from("profiles").update({ active_theme: slug }).eq("id", user.id);
  }

  revalidatePath("/shop");
  revalidatePath("/settings/profile");
  return { ok: true };
}

export async function updateProfile(values: { display_name?: string; timezone?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("profiles").update(values).eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/settings/profile");
  revalidatePath("/dashboard");
  return { ok: true };
}
