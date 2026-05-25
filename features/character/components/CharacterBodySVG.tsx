"use client";
import { memo } from "react";
import { SKIN_TONES, HAIR_COLORS, type CharacterData } from "@/types/character.types";

type OutfitStyle = { body: string; pants: string; shoes: string; accent: string };

const OUTFIT: Record<string, OutfitStyle> = {
  default:        { body: "#5B8DB8", pants: "#2C3E50", shoes: "#1a252f", accent: "#a8d4f5" },
  outfit_knight:  { body: "#7f8c8d", pants: "#5d6d7e", shoes: "#424949", accent: "#d5d8dc" },
  outfit_wizard:  { body: "#7d3c98", pants: "#5b2c6f", shoes: "#4a235a", accent: "#f8c471" },
  outfit_space:   { body: "#eaecee", pants: "#aeb6bf", shoes: "#808b96", accent: "#3498db" },
  outfit_chef:    { body: "#fdfefe", pants: "#2c3e50", shoes: "#1a252f", accent: "#e74c3c" },
  outfit_astro:   { body: "#5dade2", pants: "#2e86c1", shoes: "#1a5276", accent: "#eaecee" },
  outfit_ninja:   { body: "#1a1a2e", pants: "#16213e", shoes: "#0f3460", accent: "#e94560" },
  outfit_royal:   { body: "#1a5276", pants: "#154360", shoes: "#0e2a47", accent: "#f1c40f" },
};

const PX = { sm: 64, md: 100, lg: 160 };

function darken(hex: string, amount = 30): string {
  if (!hex.startsWith("#") || hex.length < 7) return hex;
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function HairFront({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "short":
      return (
        <g fill={color}>
          <ellipse cx="40" cy="9" rx="19" ry="12" />
          <ellipse cx="21.5" cy="20" rx="6" ry="7" />
          <ellipse cx="58.5" cy="20" rx="6" ry="7" />
        </g>
      );
    case "long":
      return (
        <g fill={color}>
          <ellipse cx="40" cy="9" rx="19" ry="12" />
          <ellipse cx="21.5" cy="20" rx="6" ry="7" />
          <ellipse cx="58.5" cy="20" rx="6" ry="7" />
        </g>
      );
    case "curly":
      return (
        <g fill={color}>
          <circle cx="23" cy="13" r="8" />
          <circle cx="32" cy="8" r="9" />
          <circle cx="40" cy="6" r="9" />
          <circle cx="48" cy="8" r="9" />
          <circle cx="57" cy="13" r="8" />
          <rect x="23" y="10" width="34" height="13" />
          <circle cx="20" cy="22" r="7" />
          <circle cx="60" cy="22" r="7" />
        </g>
      );
    case "bun":
      return (
        <g fill={color}>
          <ellipse cx="40" cy="11" rx="19" ry="10" />
          <circle cx="40" cy="4" r="9" />
          <circle cx="37.5" cy="2.5" r="2.5" fill="rgba(255,255,255,0.25)" />
          <ellipse cx="21.5" cy="20" rx="5.5" ry="6" />
          <ellipse cx="58.5" cy="20" rx="5.5" ry="6" />
        </g>
      );
    case "wild":
      return (
        <g fill={color}>
          <polygon points="40,1 34,13 46,13" />
          <polygon points="24,7 23,18 33,15" />
          <polygon points="56,7 57,18 47,15" />
          <polygon points="30,4 29,16 38,14" />
          <polygon points="50,4 51,16 42,14" />
          <ellipse cx="40" cy="13" rx="18" ry="9" />
          <circle cx="20" cy="22" r="7" />
          <circle cx="60" cy="22" r="7" />
        </g>
      );
    default:
      return null;
  }
}

function OutfitDetail({ outfit, style }: { outfit: string; style: OutfitStyle }) {
  switch (outfit) {
    case "default":
      return (
        <>
          <circle cx="40" cy="50" r="1.6" fill="rgba(255,255,255,0.4)" />
          <circle cx="40" cy="57" r="1.6" fill="rgba(255,255,255,0.4)" />
          <circle cx="40" cy="64" r="1.6" fill="rgba(255,255,255,0.4)" />
        </>
      );
    case "outfit_knight":
      return (
        <>
          <rect x="4" y="38" width="17" height="10" rx="5" fill={style.accent} />
          <rect x="59" y="38" width="17" height="10" rx="5" fill={style.accent} />
          <rect x="38" y="48" width="4" height="20" rx="2" fill="rgba(255,255,255,0.28)" />
          <rect x="31" y="56" width="18" height="4" rx="2" fill="rgba(255,255,255,0.28)" />
        </>
      );
    case "outfit_wizard":
      return (
        <>
          <text x="31" y="60" fontSize="10" fill={style.accent} fontFamily="serif" textAnchor="middle">★</text>
          <text x="45" y="54" fontSize="7" fill={style.accent} fontFamily="serif" textAnchor="middle">★</text>
          <text x="40" y="70" fontSize="6" fill={style.accent} fontFamily="serif" textAnchor="middle">★</text>
          <rect x="18" y="68" width="44" height="4" rx="2" fill={darken(style.body, 25)} />
        </>
      );
    case "outfit_space":
      return (
        <>
          <rect x="27" y="47" width="26" height="18" rx="5" fill={style.accent} />
          <rect x="29" y="49" width="22" height="14" rx="4" fill={darken(style.accent, 20)} />
          <text x="40" y="60" fontSize="8" fill={style.accent} textAnchor="middle" fontFamily="monospace">✦</text>
          <circle cx="25" cy="61" r="3.5" fill={style.accent} />
        </>
      );
    case "outfit_chef":
      return (
        <>
          <path d="M32 40 L40 52 L48 40" stroke={darken(style.body, 30)} strokeWidth="2" fill="none" />
          <circle cx="35" cy="50" r="2" fill="#dedede" />
          <circle cx="35" cy="58" r="2" fill="#dedede" />
          <circle cx="35" cy="66" r="2" fill="#dedede" />
          <circle cx="45" cy="50" r="2" fill="#dedede" />
          <circle cx="45" cy="58" r="2" fill="#dedede" />
          <circle cx="45" cy="66" r="2" fill="#dedede" />
        </>
      );
    case "outfit_astro":
      return (
        <>
          <rect x="25" y="45" width="30" height="22" rx="8" fill={style.accent} />
          <rect x="27" y="47" width="26" height="18" rx="7" fill={darken(style.accent, 15)} />
          <circle cx="37" cy="68" r="4.5" fill={style.accent} />
          <circle cx="37" cy="68" r="2.5" fill={style.body} />
        </>
      );
    case "outfit_ninja":
      return (
        <>
          <rect x="18" y="65" width="44" height="5" rx="2" fill={style.accent} />
          <path d="M40 65 L36 73 L41 72 Z" fill={style.accent} />
        </>
      );
    case "outfit_royal":
      return (
        <>
          <path d="M24 40 L40 55 L56 40" stroke={style.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="40" cy="55" r="3" fill={style.accent} />
          <circle cx="40" cy="63" r="3" fill={style.accent} />
          <rect x="6" y="56" width="13" height="5" rx="2.5" fill={style.accent} />
          <rect x="61" y="56" width="13" height="5" rx="2.5" fill={style.accent} />
        </>
      );
    default:
      return null;
  }
}

function AccessorySVG({ accessory }: { accessory: string }) {
  switch (accessory) {
    case "glasses":
      return (
        <g stroke="#aaa" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <circle cx="33" cy="21.5" r="5.5" />
          <circle cx="47" cy="21.5" r="5.5" />
          <line x1="38.5" y1="21.5" x2="41.5" y2="21.5" />
          <line x1="27.5" y1="21.5" x2="22" y2="21" />
          <line x1="52.5" y1="21.5" x2="58" y2="21" />
        </g>
      );
    case "sunglasses":
      return (
        <g>
          <circle cx="33" cy="21.5" r="5.5" fill="rgba(0,0,0,0.7)" />
          <circle cx="47" cy="21.5" r="5.5" fill="rgba(0,0,0,0.7)" />
          <line x1="38.5" y1="21.5" x2="41.5" y2="21.5" stroke="#888" strokeWidth="1.5" />
          <line x1="27.5" y1="21.5" x2="22" y2="21" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="52.5" y1="21.5" x2="58" y2="21" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case "hat":
      return (
        <g>
          <ellipse cx="40" cy="4" rx="23" ry="5" fill="#1a1a1a" />
          <rect x="29" y="-14" width="22" height="20" rx="3" fill="#1a1a1a" />
          <rect x="29" y="2" width="22" height="4" fill="#cc2222" />
        </g>
      );
    case "cap":
      return (
        <g>
          <path d="M21 22 Q40 2 59 22" fill="#E74C3C" />
          <ellipse cx="40" cy="22" rx="19" ry="6" fill="#C0392B" />
          <path d="M40 22 Q64 19 67 25 Q64 29 40 28" fill="#C0392B" />
        </g>
      );
    case "crown":
      return (
        <g>
          <rect x="27" y="0" width="26" height="7" rx="1.5" fill="#F1C40F" />
          <polygon points="27,0 29,-8 33,0" fill="#F1C40F" />
          <polygon points="37,0 40,-11 43,0" fill="#F1C40F" />
          <polygon points="47,0 51,-8 53,0" fill="#F1C40F" />
          <circle cx="30" cy="2" r="2" fill="#E74C3C" />
          <circle cx="40" cy="2" r="2.5" fill="#3498DB" />
          <circle cx="50" cy="2" r="2" fill="#E74C3C" />
        </g>
      );
    case "headband":
      return (
        <path
          d="M21 25 Q40 14 59 25"
          stroke="#E74C3C"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      );
    default:
      return null;
  }
}

interface Props {
  character: CharacterData;
  size?: "sm" | "md" | "lg";
}

export const CharacterBodySVG = memo(function CharacterBodySVG({ character, size = "md" }: Props) {
  const skin = SKIN_TONES[character.skin]?.color ?? "#F0B882";
  const hair = HAIR_COLORS[character.hair_color]?.color ?? "#1a1a1a";
  const out = OUTFIT[character.outfit] ?? OUTFIT.default;
  const px = PX[size];
  const skinDark = darken(skin, 28);

  return (
    <svg width={px} height={Math.round(px * 1.25)} viewBox="0 0 80 100" style={{ overflow: "visible" }}>
      {/* 1. Long hair back strands (behind everything) */}
      {character.hair === "long" && (
        <g fill={hair}>
          <path d="M18 14 Q14 36 16 72 Q17 78 21 78 Q25 78 26 72 Q24 36 23 14 Z" />
          <path d="M62 14 Q66 36 64 72 Q63 78 59 78 Q55 78 54 72 Q56 36 57 14 Z" />
        </g>
      )}

      {/* 2. Body */}
      <rect x="18" y="40" width="44" height="32" rx="8" fill={out.body} />

      {/* 3. Arms */}
      <rect x="6" y="42" width="13" height="22" rx="6" fill={out.body} />
      <rect x="61" y="42" width="13" height="22" rx="6" fill={out.body} />

      {/* 4. Outfit chest + shoulder details */}
      <OutfitDetail outfit={character.outfit} style={out} />

      {/* 5. Hands */}
      <circle cx="12.5" cy="63.5" r="5" fill={skin} />
      <circle cx="67.5" cy="63.5" r="5" fill={skin} />

      {/* 6. Legs / pants */}
      <rect x="21" y="69" width="15" height="26" rx="6" fill={out.pants} />
      <rect x="44" y="69" width="15" height="26" rx="6" fill={out.pants} />

      {/* 7. Feet / shoes */}
      <ellipse cx="28.5" cy="93" rx="10" ry="6" fill={out.shoes} />
      <ellipse cx="51.5" cy="93" rx="10" ry="6" fill={out.shoes} />

      {/* 8. Neck */}
      <rect x="35" y="37" width="10" height="7" fill={skin} />

      {/* 9. Head */}
      <circle cx="40" cy="22" r="19" fill={skin} />

      {/* 10. Cheeks */}
      <ellipse cx="26" cy="27" rx="5" ry="3.5" fill="#ffb6c1" opacity="0.45" />
      <ellipse cx="54" cy="27" rx="5" ry="3.5" fill="#ffb6c1" opacity="0.45" />

      {/* 11. Hair front */}
      <HairFront style={character.hair} color={hair} />

      {/* 12. Eyebrows */}
      <path d="M28.5 13.5 Q33 11 37 13.5" stroke={hair} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M43 13.5 Q47 11 51.5 13.5" stroke={hair} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* 13. Eyes */}
      <circle cx="33" cy="21.5" r="4.5" fill="white" />
      <circle cx="34" cy="22.5" r="3" fill="#1a1a2e" />
      <circle cx="35.5" cy="21" r="1.2" fill="white" />
      <circle cx="47" cy="21.5" r="4.5" fill="white" />
      <circle cx="47.5" cy="22.5" r="3" fill="#1a1a2e" />
      <circle cx="49" cy="21" r="1.2" fill="white" />

      {/* 14. Nose */}
      <path d="M38.5 27 L40 29.5 L41.5 27" stroke={skinDark} strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* 15. Mouth */}
      <path d="M34 32 Q40 37.5 46 32" stroke="#cc7766" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* 16. Accessory */}
      <AccessorySVG accessory={character.accessory} />
    </svg>
  );
});
