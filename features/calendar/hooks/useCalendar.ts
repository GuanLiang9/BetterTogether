"use client";

import { useEffect, useCallback } from "react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { useAuthStore } from "@/stores/authStore";
import { useCalendarStore } from "@/stores/calendarStore";
import { createEvent, updateEvent, deleteEvent } from "../actions/calendar.actions";
import type { EventFormValues } from "../actions/calendar.actions";
import type { CalendarEvent } from "@/types/app.types";
import { format, startOfMonth, endOfMonth, addMonths } from "date-fns";

export function useCalendar() {
  const supabase = useSupabase();
  const profile = useAuthStore((s) => s.profile);
  const {
    events, viewMode, selectedDate, isLoading,
    setEvents, addEvent, updateEvent: updateStore, removeEvent,
    setSelectedDate, setViewMode, setLoading, setHydratedForId,
  } = useCalendarStore();

  useEffect(() => {
    if (!profile?.couple_id) return;
    // Skip if already loaded for this couple — realtime handles incremental updates
    if (useCalendarStore.getState().hydratedForId === profile.couple_id) return;
    setHydratedForId(profile.couple_id);
    setLoading(true);

    const start = format(startOfMonth(addMonths(new Date(), -1)), "yyyy-MM-dd");
    const end = format(endOfMonth(addMonths(new Date(), 2)), "yyyy-MM-dd");

    supabase
      .from("events")
      .select("*")
      .eq("couple_id", profile.couple_id)
      .gte("starts_at", start)
      .lte("starts_at", end)
      .order("starts_at", { ascending: true })
      .then(({ data }) => {
        if (data) setEvents(data);
        setLoading(false);
      });
  }, [profile?.couple_id, supabase, setEvents, setLoading, setHydratedForId]);

  const handleCreateEvent = useCallback(
    async (formData: EventFormValues, reminderMins?: number | null) => {
      const result = await createEvent(formData, reminderMins);
      if (result?.data) addEvent(result.data as CalendarEvent);
      return result;
    },
    [addEvent],
  );

  const handleUpdateEvent = useCallback(
    async (eventId: string, formData: Partial<EventFormValues>) => {
      const result = await updateEvent(eventId, formData);
      if (result?.data) updateStore(eventId, result.data as Partial<CalendarEvent>);
      return result;
    },
    [updateStore],
  );

  const handleDeleteEvent = useCallback(
    async (eventId: string) => {
      const result = await deleteEvent(eventId);
      if (result?.success) removeEvent(eventId);
      return result;
    },
    [removeEvent],
  );

  const eventsOnDate = useCallback(
    (date: string) => events.filter((e) => e.starts_at.startsWith(date)),
    [events],
  );

  const upcomingEvents = events.filter(
    (e) => new Date(e.starts_at) > new Date(),
  ).slice(0, 5);

  return {
    events, viewMode, selectedDate, isLoading, upcomingEvents,
    setSelectedDate, setViewMode,
    createEvent: handleCreateEvent,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
    eventsOnDate,
  };
}
