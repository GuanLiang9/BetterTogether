"use client";

import { useEffect } from "react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { useAuthStore } from "@/stores/authStore";
import { useCalendarStore } from "@/stores/calendarStore";
import type { CalendarEvent } from "@/types/app.types";

export function useCalendarRealtime() {
  const supabase = useSupabase();
  const profile = useAuthStore((s) => s.profile);
  const { addEvent, updateEvent, removeEvent } = useCalendarStore();

  useEffect(() => {
    if (!profile?.couple_id) return;

    const channel = supabase
      .channel(`calendar:${profile.couple_id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "events",
          filter: `couple_id=eq.${profile.couple_id}` },
        (payload) => addEvent(payload.new as CalendarEvent),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "events",
          filter: `couple_id=eq.${profile.couple_id}` },
        (payload) => updateEvent((payload.new as CalendarEvent).id, payload.new as Partial<CalendarEvent>),
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "events",
          filter: `couple_id=eq.${profile.couple_id}` },
        (payload) => removeEvent((payload.old as { id: string }).id),
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile?.couple_id, supabase, addEvent, updateEvent, removeEvent]);
}
