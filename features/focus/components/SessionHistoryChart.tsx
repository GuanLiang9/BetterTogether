"use client";

import { useMemo, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format, subDays } from "date-fns";

interface Session {
  started_at: string;
  actual_mins: number | null;
}

interface SessionHistoryChartProps {
  sessions: Session[];
}

export function SessionHistoryChart({ sessions }: SessionHistoryChartProps) {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => { setToday(new Date()); }, []);

  const data = useMemo(() => {
    if (!today) return [];
    const dayMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = format(subDays(today, i), "yyyy-MM-dd");
      dayMap[d] = 0;
    }
    for (const s of sessions) {
      const d = s.started_at.split("T")[0];
      if (d in dayMap) {
        dayMap[d] += s.actual_mins ?? 0;
      }
    }
    return Object.entries(dayMap).map(([date, mins]) => ({
      date,
      label: format(new Date(date + "T12:00:00"), "EEE"),
      mins,
    }));
  }, [today, sessions]);

  if (!today) return null;

  const total = data.reduce((sum, d) => sum + d.mins, 0);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs">
        <span className="text-emerald-400 font-bold">{payload[0].value} min</span>
      </div>
    );
  };

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">This week</p>
        <p className="text-xs text-slate-500">{total} min total</p>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={data} barSize={18}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "rgba(148,163,184,0.6)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="mins" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.date}
                fill={entry.mins > 0 ? "url(#focusGrad)" : "rgba(255,255,255,0.06)"}
              />
            ))}
          </Bar>
          <defs>
            <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
