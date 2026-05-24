"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useSupabase } from "./SupabaseProvider";
import { useToast } from "./ToastProvider";
import { useAuthStore } from "@/stores/authStore";
import { useCoupleStore } from "@/stores/coupleStore";
import { useGamificationStore } from "@/stores/gamificationStore";
import { useHomeStore } from "@/stores/homeStore";
import type { Profile } from "@/types/app.types";
import type { HomePlacement } from "@/types/home.types";
import { REALTIME_EVENTS } from "@/types/realtime.types";
import type { ReactionPayload, NudgePayload } from "@/types/realtime.types";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const supabase = useSupabase();
  const { showNudge } = useToast();
  // Read only identity fields so this component doesn't re-render on every XP tick
  const profileId = useAuthStore((s) => s.profile?.id);
  const coupleId = useAuthStore((s) => s.profile?.couple_id);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // ── Profile Postgres-Changes: XP / coins / level from DB triggers ──────────
  useEffect(() => {
    if (!profileId) return;
    const ch = supabase
      .channel(`profile:${profileId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${profileId}` },
        (payload) => {
          const updated = payload.new as Profile;
          const prev = payload.old as Partial<Profile>;
          useAuthStore.getState().updateProfile(updated);

          const gStore = useGamificationStore.getState();
          gStore.setXp(updated.xp);
          gStore.setCoins(updated.coins);
          gStore.setLevel(updated.level);

          const xpDelta = updated.xp - (prev.xp ?? updated.xp);
          const coinDelta = updated.coins - (prev.coins ?? updated.coins);
          if (xpDelta > 0) gStore.triggerXpGain(xpDelta);
          if (coinDelta > 0) gStore.triggerCoinGain(coinDelta);
          if (updated.level > (prev.level ?? updated.level)) gStore.triggerLevelUp(updated.level);
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [profileId, supabase]);

  // ── Couple channel: reactions, nudges, presence, home placements ──────────
  useEffect(() => {
    if (!coupleId || !profileId) return;

    const ch = supabase.channel(`couple:${coupleId}`);
    channelRef.current = ch;

    ch.on("broadcast", { event: REALTIME_EVENTS.REACTION_SENT }, ({ payload }) => {
      const p = payload as ReactionPayload;
      if (p.fromUserId === profileId) return;
      useCoupleStore.getState().addReaction({
        id: p.id ?? nanoid(),
        emoji: p.emoji,
        fromUserId: p.fromUserId,
        fromDisplayName: p.fromDisplayName,
        timestamp: Date.now(),
      });
    });

    ch.on("broadcast", { event: REALTIME_EVENTS.NUDGE_SENT }, ({ payload }) => {
      const p = payload as NudgePayload;
      showNudge(p.message, p.fromDisplayName);
    });

    // Home placements — real-time room sync between partners
    ch
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "home_placements", filter: `couple_id=eq.${coupleId}` },
        (payload) => { useHomeStore.getState().addPlacement(payload.new as HomePlacement); },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "home_placements", filter: `couple_id=eq.${coupleId}` },
        (payload) => { useHomeStore.getState().removePlacement((payload.old as { id: string }).id); },
      );

    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState<{ userId?: string }>();
      const partnerPresent = Object.values(state)
        .flat()
        .some((p) => p.userId && p.userId !== profileId);
      useCoupleStore.getState().setPartnerOnline(partnerPresent);
    });

    ch.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track({ userId: profileId, status: "online" });
      }
    });

    return () => {
      supabase.removeChannel(ch);
      channelRef.current = null;
    };
    // showNudge is stable (comes from context), supabase ref is stable
  }, [coupleId, profileId, supabase, showNudge]);

  return <>{children}</>;
}
