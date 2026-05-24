"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function createCoupleLink() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check if already in a couple
  const { data: existing } = await supabase
    .from("couple_links")
    .select("id, status, invite_code")
    .eq("user_a_id", user.id)
    .maybeSingle();

  if (existing) return existing;

  const code = generateInviteCode();
  const { data, error } = await supabase
    .from("couple_links")
    .insert({ user_a_id: user.id, invite_code: code })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function acceptInvite(code: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check user isn't already in a couple
  const { data: profile } = await supabase
    .from("profiles")
    .select("couple_id")
    .eq("id", user.id)
    .single();

  if (profile?.couple_id) throw new Error("You are already linked to a partner");

  // Find the couple link by invite code
  const { data: link, error: findError } = await supabase
    .from("couple_links")
    .select("*")
    .eq("invite_code", code.toUpperCase())
    .eq("status", "pending")
    .is("user_b_id", null)
    .single();

  if (findError || !link) throw new Error("Invalid or expired invite code");
  if (link.user_a_id === user.id) throw new Error("You cannot link with yourself");

  // Accept the invite — trigger handle_couple_link_accept fires
  const { error: updateError } = await supabase
    .from("couple_links")
    .update({ user_b_id: user.id })
    .eq("id", link.id);

  if (updateError) throw new Error(updateError.message);

  revalidatePath("/partner");
  revalidatePath("/dashboard");
  return link.id;
}

export async function sendNudge(message: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("couple_id, display_name")
    .eq("id", user.id)
    .single();

  if (!profile?.couple_id) throw new Error("Not linked to a partner");

  // Nudge is handled via realtime broadcast in the client
  // Just return success — client broadcasts via RealtimeProvider
  return { message, fromDisplayName: profile.display_name };
}

export async function dissolveCouple() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("couple_id")
    .eq("id", user.id)
    .single();

  if (!profile?.couple_id) throw new Error("Not in a couple");

  await supabase
    .from("couple_links")
    .update({ status: "dissolved" })
    .eq("id", profile.couple_id);

  await supabase
    .from("profiles")
    .update({ couple_id: null })
    .eq("couple_id", profile.couple_id);

  revalidatePath("/partner");
  redirect("/dashboard");
}
