"use client";
import { memo } from "react";
import { cn } from "@/lib/utils/cn";
import {
  CHARACTER_BASES,
  CHARACTER_FRAMES,
  CHARACTER_ACCESSORIES,
  type CharacterConfig,
} from "@/stores/characterStore";

interface CharacterCardProps {
  config: CharacterConfig;
  size?: "sm" | "md" | "lg";
  displayName?: string;
  level?: number;
  className?: string;
}

export const CharacterCard = memo(function CharacterCard({
  config,
  size = "md",
  displayName,
  level,
  className,
}: CharacterCardProps) {
  const base = CHARACTER_BASES.find((b) => b.id === config.base) ?? CHARACTER_BASES[0];
  const frame = CHARACTER_FRAMES.find((f) => f.id === config.frame) ?? CHARACTER_FRAMES[0];
  const accessory = CHARACTER_ACCESSORIES.find((a) => a.id === config.accessory) ?? CHARACTER_ACCESSORIES[0];

  const sizes = {
    sm: { card: "w-16 h-20", avatar: "text-3xl", ring: "h-14 w-14", name: "text-[10px]" },
    md: { card: "w-28 h-36", avatar: "text-5xl", ring: "h-24 w-24", name: "text-xs" },
    lg: { card: "w-40 h-52", avatar: "text-7xl", ring: "h-36 w-36", name: "text-sm" },
  };
  const s = sizes[size];

  const frameStyles: Record<string, React.CSSProperties> = {
    none: {},
    glow: { boxShadow: "0 0 20px var(--app-accent-from, #10b981), 0 0 40px rgba(16,185,129,0.25)" },
    double: {
      border: "3px double rgba(255,255,255,0.3)",
      outline: "2px solid rgba(255,255,255,0.1)",
      outlineOffset: "3px",
    },
    pixel: { borderRadius: "4px", imageRendering: "pixelated" },
    galaxy: { boxShadow: "0 0 30px rgba(139,92,246,0.38), 0 0 60px rgba(6,182,212,0.25)" },
  };

  const frameStyle = frameStyles[frame.id] ?? {};

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn("relative rounded-2xl flex items-center justify-center", s.card)}
        style={{ background: base.gradient, ...frameStyle }}
      >
        {/* Accessory top */}
        {accessory.emoji && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl leading-none z-10">
            {accessory.emoji}
          </span>
        )}
        {/* Avatar */}
        <span className={cn("select-none", s.avatar)}>{config.avatar}</span>
        {/* Level badge */}
        {level !== undefined && (
          <div className="absolute bottom-1 right-1 bg-black/40 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white">
            {level}
          </div>
        )}
      </div>
      {/* Name + title */}
      {displayName && (
        <div className="text-center">
          <p className={cn("font-bold text-slate-200", s.name)}>{displayName}</p>
          <p className="text-[9px] text-slate-500 -mt-0.5">{config.title}</p>
        </div>
      )}
    </div>
  );
});
