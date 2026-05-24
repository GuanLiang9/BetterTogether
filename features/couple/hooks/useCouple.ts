"use client";

import { useEffect } from "react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { useAuthStore } from "@/stores/authStore";
import { useCoupleStore } from "@/stores/coupleStore";
import type { ReactionEvent } from "@/types/app.types";
import { REALTIME_EVENTS } from "@/types/realtime.types";
import { nanoid } from "nanoid";

export function useCouple() {
  const supabase = useSupabase();
  const profile = useAuthStore((s) => s.profile);
  const { couple, partner, partnerOnline, pendingReactions, setCouple, setPartner, setPartnerOnline, addReaction } =
    useCoupleStore();

  useEffect(() => {
    if (!profile?.couple_id) return;

    // Load couple + partner data
    supabase
      .from("couple_links")
      .select("*")
      .eq("id", profile.couple_id)
      .single()
      .then(({ data }) => { if (data) setCouple(data); });

    supabase
      .from("profiles")
      .select("*")
      .eq("couple_id", profile.couple_id)
      .neq("id", profile.id)
      .maybeSingle()
      .then(({ data }) => { if (data) setPartner(data); });
  }, [profile?.couple_id, profile?.id, supabase, setCouple, setPartner]);

  async function sendReaction(emoji: string) {
    if (!profile?.couple_id || !profile) return;
    const channel = supabase.channel(`couple:${profile.couple_id}`);
    await channel.send({
      type: "broadcast",
      event: REALTIME_EVENTS.REACTION_SENT,
      payload: {
        emoji,
        fromUserId: profile.id,
        fromDisplayName: profile.display_name,
        id: nanoid(),
      },
    });
  }

  async function sendNudgeMessage(message: string) {
    if (!profile?.couple_id || !profile) return;
    const channel = supabase.channel(`couple:${profile.couple_id}`);
    await channel.send({
      type: "broadcast",
      event: REALTIME_EVENTS.NUDGE_SENT,
      payload: { message, fromDisplayName: profile.display_name },
    });
  }

  return { couple, partner, partnerOnline, pendingReactions, sendReaction, sendNudgeMessage };
}
