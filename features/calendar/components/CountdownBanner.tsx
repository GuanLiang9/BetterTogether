"use client";

import { useMemo } from "react";
import { differenceInDays, differenceInHours, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useCalendarStore } from "@/stores/calendarStore";
import Link from "next/link";

export function CountdownBanner() {
  const events = useCalendarStore((s) => s.events);

  const nextEvent = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => new Date(e.starts_at) > now)
      .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())[0] ?? null;
  }, [events]);

  if (!nextEvent) return null;

  const now = new Date();
  const start = parseISO(nextEvent.starts_at);
  const days = differenceInDays(start, now);
  const hours = differenceInHours(start, now);

  const countdownText =
    days === 0
      ? hours <= 1
        ? "in less than an hour"
        : `in ${hours} hours`
      : days === 1
      ? "tomorrow"
      : `in ${days} days`;

  return (
    <Link href="/calendar">
      <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 border border-white/5 hover:border-emerald-500/20 transition-colors">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: `${nextEvent.color}22` }}
        >
          {nextEvent.emoji ?? "📅"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Next event</p>
          <p className="text-sm font-medium text-slate-100 truncate">{nextEvent.title}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-emerald-400 font-medium">{countdownText}</p>
        </div>
      </div>
    </Link>
  );
}
