"use client";

import { useEffect, useRef } from "react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { useAuthStore } from "@/stores/authStore";
import { useFocusStore } from "@/stores/focusStore";
import { REALTIME_EVENTS } from "@/types/realtime.types";
import type { FocusTickPayload } from "@/types/realtime.types";

const TICK_INTERVAL_MS = 5000;

export function useFocusRealtime() {
  const supabase = useSupabase();
  const profile = useAuthStore((s) => s.profile);
  const { activeSession, timerStatus, remainingSecs, setPartnerTimer } = useFocusStore();
  const broadcastIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!profile?.couple_id) return;

    const channel = supabase.channel(`couple:${profile.couple_id}`);

    // Receive partner's timer ticks
    channel.on("broadcast", { event: REALTIME_EVENTS.FOCUS_SESSION_TICK }, ({ payload }) => {
      const p = payload as FocusTickPayload;
      setPartnerTimer({ remainingSecs: p.remainingSecs, status: p.status });
    });

    channel.subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile?.couple_id, supabase, setPartnerTimer]);

  // Broadcast own timer state every 5s when running
  useEffect(() => {
    if (!profile?.couple_id || !activeSession || timerStatus === "idle") {
      if (broadcastIntervalRef.current) {
        clearInterval(broadcastIntervalRef.current);
        broadcastIntervalRef.current = null;
      }
      return;
    }

    const broadcastTick = () => {
      const state = useFocusStore.getState();
      if (!state.activeSession) return;
      supabase.channel(`couple:${profile.couple_id!}`).send({
        type: "broadcast",
        event: REALTIME_EVENTS.FOCUS_SESSION_TICK,
        payload: {
          sessionId: state.activeSession.id,
          remainingSecs: state.remainingSecs,
          status: state.timerStatus as "running" | "paused" | "break",
        } satisfies FocusTickPayload,
      });
    };

    broadcastIntervalRef.current = setInterval(broadcastTick, TICK_INTERVAL_MS);

    return () => {
      if (broadcastIntervalRef.current) {
        clearInterval(broadcastIntervalRef.current);
        broadcastIntervalRef.current = null;
      }
    };
  }, [profile?.couple_id, activeSession?.id, timerStatus, supabase]);
}
