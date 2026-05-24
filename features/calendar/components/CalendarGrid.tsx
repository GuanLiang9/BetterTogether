"use client";

import { useMemo } from "react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameMonth, isToday, isSameDay, parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarEvent } from "@/types/app.types";

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: string;
  events: CalendarEvent[];
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({
  currentMonth, selectedDate, events, onSelectDate, onPrevMonth, onNextMonth,
}: CalendarGridProps) {
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const eventDateSet = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of events) {
      const d = e.starts_at.split("T")[0];
      if (!map[d]) map[d] = [];
      map[d].push(e);
    }
    return map;
  }, [events]);

  const selected = parseISO(selectedDate);

  return (
    <div className="glass rounded-2xl p-4">
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrevMonth} className="p-1 text-slate-400 hover:text-slate-200 transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-sm font-semibold text-slate-200">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button onClick={onNextMonth} className="p-1 text-slate-400 hover:text-slate-200 transition-colors">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-xs text-slate-600 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayEvents = eventDateSet[dateStr] ?? [];
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isDayToday = isToday(day);
          const isSelected = isSameDay(day, selected);

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`relative flex flex-col items-center py-1.5 rounded-xl transition-all ${
                isSelected
                  ? "bg-emerald-500/25 text-emerald-300"
                  : isDayToday
                  ? "bg-white/8 text-emerald-400"
                  : isCurrentMonth
                  ? "text-slate-300 hover:bg-white/5"
                  : "text-slate-700"
              }`}
            >
              <span
                className={`text-sm w-7 h-7 flex items-center justify-center rounded-full font-medium ${
                  isDayToday && !isSelected ? "ring-1 ring-emerald-500/50" : ""
                }`}
              >
                {format(day, "d")}
              </span>
              {/* Event dots */}
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayEvents.slice(0, 3).map((e) => (
                    <div
                      key={e.id}
                      className="h-1 w-1 rounded-full"
                      style={{ backgroundColor: e.color }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
