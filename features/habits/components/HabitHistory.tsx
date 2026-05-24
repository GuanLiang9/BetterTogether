"use client";

import { useMemo, useState, useEffect } from "react";
import { subDays, format, parseISO } from "date-fns";

interface HabitHistoryProps {
  completedDates: string[];
  color?: string;
}

export function HabitHistory({ completedDates, color = "#10b981" }: HabitHistoryProps) {
  const completedSet = useMemo(() => new Set(completedDates), [completedDates]);

  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => { setToday(new Date()); }, []);

  // Build last 91 days grid (13 weeks × 7 days) — only after mount to avoid hydration mismatch
  const grid = useMemo(() => {
    if (!today) return [];
    const days: { date: string; done: boolean }[] = [];
    for (let i = 90; i >= 0; i--) {
      const d = format(subDays(today, i), "yyyy-MM-dd");
      days.push({ date: d, done: completedSet.has(d) });
    }
    return days;
  }, [today, completedSet]);

  if (!today) return null;

  const totalDone = completedDates.length;

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Last 90 days</p>
        <p className="text-xs text-slate-500">{totalDone} completions</p>
      </div>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}
      >
        {grid.map(({ date, done }) => (
          <div
            key={date}
            title={date}
            className="aspect-square rounded-sm transition-all"
            style={{
              backgroundColor: done ? color : "rgba(255,255,255,0.06)",
              opacity: done ? 1 : 0.8,
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-2">
        <span className="text-xs text-slate-600">Less</span>
        {[0.1, 0.3, 0.6, 0.85, 1].map((op) => (
          <div
            key={op}
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: color, opacity: op }}
          />
        ))}
        <span className="text-xs text-slate-600">More</span>
      </div>
    </div>
  );
}
