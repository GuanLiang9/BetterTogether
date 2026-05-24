import { create } from "zustand";
import { persist } from "zustand/middleware";

export const CHARACTER_BASES = [
  { id: "emerald", label: "Emerald", gradient: "linear-gradient(135deg, #10b981, #06b6d4)" },
  { id: "violet", label: "Violet", gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
  { id: "flame", label: "Flame", gradient: "linear-gradient(135deg, #f59e0b, #ef4444)" },
  { id: "ocean", label: "Ocean", gradient: "linear-gradient(135deg, #0ea5e9, #6366f1)" },
  { id: "rose", label: "Rose", gradient: "linear-gradient(135deg, #f43f5e, #fb923c)" },
  { id: "cosmic", label: "Cosmic", gradient: "linear-gradient(135deg, #a855f7, #06b6d4)" },
] as const;

export const CHARACTER_AVATARS = [
  "🦊", "🐺", "🐉", "🦁", "🐼", "🐨", "🦋", "🦅",
  "🌟", "⚡", "🔥", "💎", "🌙", "☀️", "🌊", "🌿",
] as const;

export const CHARACTER_FRAMES = [
  { id: "none", label: "Plain" },
  { id: "glow", label: "Glow" },
  { id: "double", label: "Double" },
  { id: "pixel", label: "Pixel" },
  { id: "galaxy", label: "Galaxy" },
] as const;

export const CHARACTER_ACCESSORIES = [
  { id: "none", label: "None", emoji: "" },
  { id: "crown", label: "Crown", emoji: "👑" },
  { id: "wings", label: "Wings", emoji: "🪽" },
  { id: "halo", label: "Halo", emoji: "😇" },
  { id: "sparkle", label: "Sparkle", emoji: "✨" },
  { id: "sword", label: "Sword", emoji: "⚔️" },
  { id: "shield", label: "Shield", emoji: "🛡️" },
] as const;

export type BaseId = typeof CHARACTER_BASES[number]["id"];
export type FrameId = typeof CHARACTER_FRAMES[number]["id"];
export type AccessoryId = typeof CHARACTER_ACCESSORIES[number]["id"];

export interface CharacterConfig {
  base: BaseId;
  avatar: string;
  frame: FrameId;
  accessory: AccessoryId;
  title: string;
}

interface CharacterStore {
  config: CharacterConfig;
  setBase: (base: BaseId) => void;
  setAvatar: (avatar: string) => void;
  setFrame: (frame: FrameId) => void;
  setAccessory: (accessory: AccessoryId) => void;
  setTitle: (title: string) => void;
}

const DEFAULT_CONFIG: CharacterConfig = {
  base: "emerald",
  avatar: "🦊",
  frame: "none",
  accessory: "none",
  title: "Adventurer",
};

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      setBase: (base) => set((s) => ({ config: { ...s.config, base } })),
      setAvatar: (avatar) => set((s) => ({ config: { ...s.config, avatar } })),
      setFrame: (frame) => set((s) => ({ config: { ...s.config, frame } })),
      setAccessory: (accessory) => set((s) => ({ config: { ...s.config, accessory } })),
      setTitle: (title) => set((s) => ({ config: { ...s.config, title } })),
    }),
    { name: "character-store" }
  )
);
