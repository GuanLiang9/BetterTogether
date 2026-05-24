"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useFocusStore } from "@/stores/focusStore";

const RADIUS = 80;
const STROKE = 6;
const SIZE = (RADIUS + STROKE) * 2 + 4;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

interface FocusTimerProps {
  color?: string;
}

export function FocusTimer({ color = "#10b981" }: FocusTimerProps) {
  const { remainingSecs, totalSecs, timerStatus, plantStage } = useFocusStore();

  const progress = totalSecs > 0 ? 1 - remainingSecs / totalSecs : 1;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const isBreak = timerStatus === "break";

  const cx = SIZE / 2;
  const cy = SIZE / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={STROKE}
          />
          {/* Progress arc */}
          <motion.circle
            cx={cx} cy={cy} r={RADIUS}
            fill="none"
            stroke={isBreak ? "#6366f1" : color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          {/* Plant */}
          <span className="text-3xl leading-none select-none">
            {["🌰", "🌱", "🌿", "🪴", "🌳", "🌲"][Math.min(5, plantStage)]}
          </span>
          {/* Time */}
          <span className={`text-3xl font-bold tabular-nums tracking-tight ${isBreak ? "text-indigo-300" : "text-slate-100"}`}>
            {formatTime(remainingSecs)}
          </span>
          {isBreak && (
            <span className="text-xs text-indigo-400 uppercase tracking-widest">Break</span>
          )}
        </div>
      </div>
    </div>
  );
}
