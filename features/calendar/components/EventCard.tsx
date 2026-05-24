"use client";

import { format, parseISO } from "date-fns";
import { MapPin, Trash2 } from "lucide-react";
import type { CalendarEvent } from "@/types/app.types";

interface EventCardProps {
  event: CalendarEvent;
  onDelete?: () => void;
}

export function EventCard({ event, onDelete }: EventCardProps) {
  const start = parseISO(event.starts_at);
  const timeStr = event.all_day ? "All day" : format(start, "h:mm a");

  return (
    <div className="glass rounded-xl px-4 py-3 flex items-start gap-3">
      {/* Color bar */}
      <div className="w-1 self-stretch rounded-full mt-0.5 shrink-0" style={{ backgroundColor: event.color }} />

      {/* Emoji + content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {event.emoji && <span className="text-base">{event.emoji}</span>}
          <p className="text-sm font-medium text-slate-100 truncate">{event.title}</p>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{timeStr}</p>
        {event.location && (
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3 text-slate-600" />
            <p className="text-xs text-slate-600 truncate">{event.location}</p>
          </div>
        )}
        {event.description && (
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{event.description}</p>
        )}
      </div>

      {onDelete && (
        <button
          onClick={onDelete}
          className="text-slate-700 hover:text-red-500 transition-colors shrink-0 mt-0.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
