import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "emerald" | "cyan" | "amber" | "red" | "slate";
  className?: string;
}

const VARIANTS = {
  default: "bg-white/10 text-slate-300",
  emerald: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  cyan: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  amber: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  red: "bg-red-500/20 text-red-400 border border-red-500/30",
  slate: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
