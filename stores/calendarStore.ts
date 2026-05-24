import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CalendarEvent } from "@/types/app.types";

type ViewMode = "month" | "week" | "day";

interface CalendarStore {
  events: CalendarEvent[];
  viewMode: ViewMode;
  selectedDate: string;
  isLoading: boolean;
  hydratedForId: string | null;
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (eventId: string, partial: Partial<CalendarEvent>) => void;
  removeEvent: (eventId: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedDate: (date: string) => void;
  setLoading: (loading: boolean) => void;
  setHydratedForId: (id: string) => void;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      events: [],
      viewMode: "month",
      selectedDate: new Date().toISOString().slice(0, 10),
      isLoading: false,
      hydratedForId: null,
      setEvents: (events) => set({ events }),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (eventId, partial) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === eventId ? { ...e, ...partial } : e)),
        })),
      removeEvent: (eventId) =>
        set((state) => ({ events: state.events.filter((e) => e.id !== eventId) })),
      setViewMode: (viewMode) => set({ viewMode }),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      setLoading: (isLoading) => set({ isLoading }),
      setHydratedForId: (id) => set({ hydratedForId: id }),
    }),
    {
      name: "calendar-store",
      partialize: (state) => ({ viewMode: state.viewMode }),
    },
  ),
);
