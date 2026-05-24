"use client";

import { SKIN_TONES, ACCESSORIES, OUTFIT_EMOJIS, type CharacterData } from "@/types/character.types";

interface CharacterPreviewProps {
  character: CharacterData;
  size?: "sm" | "md" | "lg";
  name?: string;
}

const SIZE_MAP = {
  sm: { outer: 48, head: 32, body: 20, font: "text-xl", nameFont: "text-xs" },
  md: { outer: 80, head: 52, body: 32, font: "text-3xl", nameFont: "text-sm" },
  lg: { outer: 120, head: 80, body: 48, font: "text-5xl", nameFont: "text-base" },
};

export function CharacterPreview({ character, size = "md", name }: CharacterPreviewProps) {
  const skin = SKIN_TONES[character.skin] ?? SKIN_TONES.warm;
  const accessory = ACCESSORIES[character.accessory];
  const outfitEmoji = OUTFIT_EMOJIS[character.outfit] ?? "👤";
  const s = SIZE_MAP[size];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative flex flex-col items-center justify-end rounded-2xl"
        style={{ width: s.outer, height: s.outer }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20"
          style={{ background: `radial-gradient(circle, ${skin.color}, transparent 70%)` }}
        />

        {/* Accessory on top */}
        {accessory?.emoji && (
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 leading-none select-none"
            style={{ fontSize: s.outer * 0.22 }}
          >
            {accessory.emoji}
          </span>
        )}

        {/* Head (skin-colored circle) */}
        <div
          className="rounded-full border-2 border-white/10 flex items-center justify-center relative"
          style={{ width: s.head, height: s.head, background: skin.color, marginBottom: 2 }}
        >
          {/* Hair color dot */}
          <div
            className="absolute top-1 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: s.head * 0.7,
              height: s.head * 0.3,
              background: `#${
                character.hair_color === "black" ? "1a1a1a" :
                character.hair_color === "brown" ? "6B3A2A" :
                character.hair_color === "blonde" ? "E8C97A" :
                character.hair_color === "red" ? "C0392B" :
                character.hair_color === "silver" ? "A8A8A8" :
                character.hair_color === "blue" ? "2980B9" :
                character.hair_color === "green" ? "27AE60" :
                character.hair_color === "purple" ? "8E44AD" : "1a1a1a"
              }`,
              borderRadius: "50% 50% 0 0",
              top: 0,
            }}
          />
        </div>

        {/* Body / outfit */}
        <span
          className="leading-none select-none"
          style={{ fontSize: s.body }}
        >
          {outfitEmoji}
        </span>
      </div>

      {name && (
        <span className={`${s.nameFont} text-slate-300 font-medium truncate max-w-full`}>
          {name}
        </span>
      )}
    </div>
  );
}
