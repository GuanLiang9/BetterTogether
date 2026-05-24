"use server";

import { createClient } from "@/lib/supabase/server";
import type { CharacterData } from "@/types/character.types";
import type { Json } from "@/types/database.types";

export async function saveCharacter(data: CharacterData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ character_data: data as unknown as Json })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  return data;
}
