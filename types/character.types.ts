export interface CharacterData {
  skin: string;
  hair: string;
  hair_color: string;
  outfit: string;
  accessory: string;
}

export const SKIN_TONES: Record<string, { label: string; color: string; emoji: string }> = {
  light:     { label: "Light",     color: "#FDDBB4", emoji: "🏻" },
  warm:      { label: "Warm",      color: "#F0B882", emoji: "🏼" },
  medium:    { label: "Medium",    color: "#D4875C", emoji: "🏽" },
  tan:       { label: "Tan",       color: "#B5673A", emoji: "🏾" },
  brown:     { label: "Brown",     color: "#8B4513", emoji: "🏿" },
  deep:      { label: "Deep",      color: "#4A2810", emoji: "🏿" },
};

export const HAIR_STYLES: Record<string, { label: string; icon: string }> = {
  short:     { label: "Short",     icon: "💇" },
  long:      { label: "Long",      icon: "👩" },
  curly:     { label: "Curly",     icon: "🧑‍🦱" },
  bald:      { label: "Bald",      icon: "🧑‍🦲" },
  bun:       { label: "Bun",       icon: "🧑‍🦳" },
  wild:      { label: "Wild",      icon: "🧑‍🦰" },
};

export const HAIR_COLORS: Record<string, { label: string; color: string }> = {
  black:     { label: "Black",     color: "#1a1a1a" },
  brown:     { label: "Brown",     color: "#6B3A2A" },
  blonde:    { label: "Blonde",    color: "#E8C97A" },
  red:       { label: "Red",       color: "#C0392B" },
  silver:    { label: "Silver",    color: "#A8A8A8" },
  blue:      { label: "Blue",      color: "#2980B9" },
  green:     { label: "Green",     color: "#27AE60" },
  purple:    { label: "Purple",    color: "#8E44AD" },
};

export const ACCESSORIES: Record<string, { label: string; emoji: string }> = {
  none:      { label: "None",      emoji: "" },
  glasses:   { label: "Glasses",   emoji: "👓" },
  sunglasses:{ label: "Shades",    emoji: "🕶️" },
  hat:       { label: "Hat",       emoji: "🎩" },
  cap:       { label: "Cap",       emoji: "🧢" },
  crown:     { label: "Crown",     emoji: "👑" },
  headband:  { label: "Headband",  emoji: "🎀" },
};

export const OUTFIT_EMOJIS: Record<string, string> = {
  default:      "👤",
  outfit_knight:"🗡️",
  outfit_wizard:"🧙",
  outfit_space: "🚀",
  outfit_chef:  "👨‍🍳",
  outfit_astro: "👩‍🚀",
  outfit_ninja: "🥷",
  outfit_royal: "🤴",
};

export const DEFAULT_CHARACTER: CharacterData = {
  skin:       "warm",
  hair:       "short",
  hair_color: "black",
  outfit:     "default",
  accessory:  "none",
};
