"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import {
  useCharacterStore,
  CHARACTER_BASES,
  CHARACTER_AVATARS,
  CHARACTER_FRAMES,
  CHARACTER_ACCESSORIES,
  type BaseId,
  type FrameId,
  type AccessoryId,
} from "@/stores/characterStore";
import { CharacterCard } from "./CharacterCard";
import { useAuthStore } from "@/stores/authStore";
import { getLevelTitle } from "@/lib/gamification/level-thresholds";
import type { CharacterData } from "@/types/character.types";

const SECTION_TITLES = ["Base", "Avatar", "Frame", "Accessory", "Title"] as const;
type Section = typeof SECTION_TITLES[number];

const PRESET_TITLES = [
  "Adventurer", "Champion", "Sage", "Guardian", "Wanderer",
  "Visionary", "Trailblazer", "Legend", "Scholar", "Warrior",
];

export function CharacterEditor() {
  const [section, setSection] = useState<Section>("Base");
  const config = useCharacterStore((s) => s.config);
  const { setBase, setAvatar, setFrame, setAccessory, setTitle } = useCharacterStore();
  const profile = useAuthStore((s) => s.profile);
  const level = profile?.level ?? 1;
  const characterData = profile?.character_data as CharacterData | null | undefined;

  return (
    <div className="flex flex-col gap-5">
      {/* Preview */}
      <div className="flex justify-center py-4">
        <CharacterCard
          config={config}
          characterData={characterData}
          size="lg"
          displayName={profile?.display_name ?? "You"}
          level={level}
        />
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {SECTION_TITLES.map((tab) => (
          <button
            key={tab}
            onClick={() => setSection(tab)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all border",
              section === tab
                ? "text-white border-transparent"
                : "bg-white/5 text-slate-400 border-white/8 hover:bg-white/8",
            )}
            style={
              section === tab
                ? {
                    background:
                      "linear-gradient(to right, var(--app-accent-from, #10b981), var(--app-accent-to, #06b6d4))",
                    borderColor: "transparent",
                  }
                : {}
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Section content */}
      <motion.div
        key={section}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {section === "Base" && (
          <div className="grid grid-cols-3 gap-3">
            {CHARACTER_BASES.map((base) => (
              <button
                key={base.id}
                onClick={() => setBase(base.id as BaseId)}
                className={cn(
                  "rounded-2xl h-16 flex flex-col items-center justify-center gap-1 border-2 transition-all",
                  config.base === base.id
                    ? "border-white/40 scale-105"
                    : "border-transparent opacity-70 hover:opacity-100",
                )}
                style={{ background: base.gradient }}
              >
                <span className="text-[10px] font-bold text-white/80">{base.label}</span>
              </button>
            ))}
          </div>
        )}

        {section === "Avatar" && (
          <div className="grid grid-cols-4 gap-3">
            {CHARACTER_AVATARS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setAvatar(emoji)}
                className={cn(
                  "h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all",
                  config.avatar === emoji
                    ? "border-white/40 bg-white/10 scale-105"
                    : "border-white/8 bg-white/5 hover:bg-white/8",
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {section === "Frame" && (
          <div className="grid grid-cols-2 gap-3">
            {CHARACTER_FRAMES.map((frame) => (
              <button
                key={frame.id}
                onClick={() => setFrame(frame.id as FrameId)}
                className={cn(
                  "glass rounded-2xl p-4 flex items-center gap-3 border-2 transition-all",
                  config.frame === frame.id ? "border-emerald-500/40" : "border-white/8",
                )}
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{
                    background:
                      CHARACTER_BASES.find((b) => b.id === config.base)?.gradient ??
                      CHARACTER_BASES[0].gradient,
                  }}
                >
                  {config.avatar}
                </div>
                <span className="text-sm font-medium text-slate-300">{frame.label}</span>
              </button>
            ))}
          </div>
        )}

        {section === "Accessory" && (
          <div className="grid grid-cols-2 gap-3">
            {CHARACTER_ACCESSORIES.map((acc) => (
              <button
                key={acc.id}
                onClick={() => setAccessory(acc.id as AccessoryId)}
                className={cn(
                  "glass rounded-2xl p-4 flex items-center gap-3 border-2 transition-all",
                  config.accessory === acc.id ? "border-emerald-500/40" : "border-white/8",
                )}
              >
                <span className="text-2xl w-8">{acc.emoji || "∅"}</span>
                <span className="text-sm font-medium text-slate-300">{acc.label}</span>
              </button>
            ))}
          </div>
        )}

        {section === "Title" && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-500 mb-1">
              Level title:{" "}
              <span className="text-emerald-400">{getLevelTitle(level)}</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_TITLES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTitle(t)}
                  className={cn(
                    "glass rounded-xl px-3 py-2.5 text-xs font-medium text-left border-2 transition-all",
                    config.title === t
                      ? "border-emerald-500/40 text-emerald-400"
                      : "border-white/8 text-slate-300",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
