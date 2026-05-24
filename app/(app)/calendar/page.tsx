"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, parseISO } from "date-fns";
import { Plus, CalendarDays, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CalendarGrid } from "@/features/calendar/components/CalendarGrid";
import { EventCard } from "@/features/calendar/components/EventCard";
import { EventForm } from "@/features/calendar/components/EventForm";
import type { EventFormValues } from "@/features/calendar/components/EventForm";
import { useCalendar } from "@/features/calendar/hooks/useCalendar";
import { useCalendarRealtime } from "@/features/calendar/hooks/useCalendarRealtime";
import { AnimatePresence, motion } from "framer-motion";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  useEffect(() => { setCurrentMonth(new Date()); }, []);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    events, selectedDate, isLoading,
    setSelectedDate, createEvent, deleteEvent, eventsOnDate,
  } = useCalendar();
  useCalendarRealtime();

  const selectedEvents = eventsOnDate(selectedDate);

  async function handleSubmit(values: EventFormValues) {
    setIsSubmitting(true);
    const { reminderMins, ...rest } = values;

    // Convert local datetime to UTC ISO for storage
    const result = await createEvent(
      { ...rest, starts_at: new Date(rest.starts_at).toISOString(),
        ends_at: rest.ends_at ? new Date(rest.ends_at).toISOString() : undefined },
      reminderMins,
    );
    setIsSubmitting(false);
    if (result?.data) setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-cyan-400" />
          <h1 className="text-2xl font-bold text-slate-100">Calendar</h1>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "New"}
        </Button>
      </div>

      {/* New event form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-5">
              <h2 className="text-sm font-semibold text-slate-200 mb-4">New event</h2>
              <EventForm
                defaultValues={{ starts_at: selectedDate + "T09:00" }}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
                submitLabel="Create event"
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar grid */}
      {isLoading || !currentMonth ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
        </div>
      ) : (
        <CalendarGrid
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          events={events}
          onSelectDate={setSelectedDate}
          onPrevMonth={() => setCurrentMonth((m) => subMonths(m!, 1))}
          onNextMonth={() => setCurrentMonth((m) => addMonths(m!, 1))}
        />
      )}

      {/* Events for selected day */}
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">
          {format(parseISO(selectedDate + "T12:00:00"), "EEEE, MMM d")}
        </p>
        {selectedEvents.length === 0 ? (
          <Card className="p-4 text-center">
            <p className="text-sm text-slate-600">No events this day</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={() => deleteEvent(event.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
