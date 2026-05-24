export interface ThemeDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  levelRequired: number;
  coinCost: number;
  accentFrom: string;
  accentTo: string;
  bgPreview: string;
}

export const THEME_DEFINITIONS: ThemeDef[] = [
  {
    id: "default",
    name: "Emerald",
    emoji: "🌿",
    description: "The classic Tralancherhawk look.",
    levelRequired: 1,
    coinCost: 0,
    accentFrom: "#10b981",
    accentTo: "#06b6d4",
    bgPreview: "#050a14",
  },
  {
    id: "midnight",
    name: "Midnight",
    emoji: "🌌",
    description: "Electric purple in the void.",
    levelRequired: 5,
    coinCost: 200,
    accentFrom: "#8b5cf6",
    accentTo: "#a78bfa",
    bgPreview: "#020206",
  },
  {
    id: "rose",
    name: "Rosé",
    emoji: "🌸",
    description: "Cherry blossom energy.",
    levelRequired: 3,
    coinCost: 150,
    accentFrom: "#f43f5e",
    accentTo: "#fb7185",
    bgPreview: "#0f0508",
  },
  {
    id: "ocean",
    name: "Ocean",
    emoji: "🌊",
    description: "Deep sea electric blue.",
    levelRequired: 4,
    coinCost: 150,
    accentFrom: "#0ea5e9",
    accentTo: "#38bdf8",
    bgPreview: "#020b14",
  },
  {
    id: "amber",
    name: "Amber",
    emoji: "🔥",
    description: "Golden hour vibes.",
    levelRequired: 6,
    coinCost: 250,
    accentFrom: "#f59e0b",
    accentTo: "#fbbf24",
    bgPreview: "#0d0800",
  },
  {
    id: "neon",
    name: "Neon",
    emoji: "⚡",
    description: "Matrix mode activated.",
    levelRequired: 8,
    coinCost: 300,
    accentFrom: "#22c55e",
    accentTo: "#86efac",
    bgPreview: "#010a01",
  },
  {
    id: "lavender",
    name: "Lavender",
    emoji: "💜",
    description: "Dream in purple.",
    levelRequired: 7,
    coinCost: 300,
    accentFrom: "#a855f7",
    accentTo: "#c084fc",
    bgPreview: "#06030f",
  },
  {
    id: "crimson",
    name: "Crimson",
    emoji: "❤️‍🔥",
    description: "Burning ambition.",
    levelRequired: 10,
    coinCost: 400,
    accentFrom: "#ef4444",
    accentTo: "#f87171",
    bgPreview: "#0d0202",
  },
];
