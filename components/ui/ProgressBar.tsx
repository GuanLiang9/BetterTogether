"use client";

import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  gradient?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  showLabel,
  gradient = true,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("relative h-2 rounded-full bg-white/10 overflow-hidden", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          gradient
            ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
            : "bg-emerald-500",
          barClassName,
        )}
        style={{ width: `${pct}%` }}
      />
      {showLabel && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-0 text-[10px] text-slate-400">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
