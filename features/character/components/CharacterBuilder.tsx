"use client";

import { useState, useMemo, memo } from "react";
import { Check, Loader2 } from "lucide-react";
import {
  SKIN_TONES, HAIR_STYLES, HAIR_COLORS, ACCESSORIES,
  DEFAULT_CHARACTER, type CharacterData,
} from "@/types/character.types";
import { useGamificationStore } from "@/stores/gamificationStore";
import { useAuthStore } from "@/stores/authStore";
import { CharacterPreview } from "./CharacterPreview";
import { saveCharacter } from "@/features/character/actions/character.actions";

const OUTFIT_OPTIONS = [
  { slug: "default",       label: "Default", emoji: "👤" },
  { slug: "outfit_knight", label: "Knight",  emoji: "🗡️" },
  { slug: "outfit_wizard", label: "Wizard",  emoji: "🧙" },
  { slug: "outfit_space",  label: "Space",   emoji: "🚀" },
  { slug: "outfit_chef",   label: "Chef",    emoji: "👨‍🍳" },
  { slug: "outfit_astro",  label: "Astro",   emoji: "👩‍🚀" },
  { slug: "outfit_ninja",  label: "Ninja",   emoji: "🥷" },
  { slug: "outfit_royal",  label: "Royal",   emoji: "🤴" },
];

export const CharacterBuilder = memo(function CharacterBuilder() {
  const profile = useAuthStore((s) => s.profile);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const userUnlockables = useGamificationStore((s) => s.userUnlockables);
  const unlockables = useGamificationStore((s) => s.unlockables);

  const rawChar = profile?.character_data as CharacterData | null;
  const [character, setCharacter] = useState<CharacterData>(rawChar ?? DEFAULT_CHARACTER);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Memoize — only recomputes when the unlockables arrays change
  const ownedSlugs = useMemo(() => {
    return new Set(
      userUnlockables.map((ua) => unlockables.find((x) => x.id === ua.unlockable_id)?.slug ?? ""),
    );
  }, [userUnlockables, unlockables]);

  function update(field: keyof CharacterData, value: string) {
    setSaved(false);
    setCharacter((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveCharacter(character);
      updateProfile({ character_data: character as unknown as import("@/types/database.types").Json });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Live preview */}
      <div className="flex flex-col items-center py-6 rounded-2xl bg-white/3 border border-white/8">
        <CharacterPreview character={character} size="lg" name={profile?.display_name ?? "You"} />
      </div>

      <Section label="Skin Tone">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(SKIN_TONES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => update("skin", key)}
              title={val.label}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                character.skin === key ? "border-emerald-400 scale-110" : "border-white/20 hover:border-white/40"
              }`}
              style={{ background: val.color }}
            />
          ))}
        </div>
      </Section>

      <Section label="Hair Style">
        <div className="grid grid-cols-6 gap-2">
          {Object.entries(HAIR_STYLES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => update("hair", key)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all ${
                character.hair === key
                  ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
              }`}
            >
              <span className="text-lg">{val.icon}</span>
              <span className="text-[10px] leading-tight">{val.label}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section label="Hair Color">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(HAIR_COLORS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => update("hair_color", key)}
              title={val.label}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                character.hair_color === key ? "border-emerald-400 scale-110" : "border-white/20 hover:border-white/40"
              }`}
              style={{ background: val.color }}
            />
          ))}
        </div>
      </Section>

      <Section label="Outfit">
        <div className="grid grid-cols-4 gap-2">
          {OUTFIT_OPTIONS.map(({ slug, label, emoji }) => {
            const isDefault = slug === "default";
            const owned = isDefault || ownedSlugs.has(slug);
            return (
              <button
                key={slug}
                onClick={() => owned && update("outfit", slug)}
                disabled={!owned}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all ${
                  character.outfit === slug
                    ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                    : owned
                    ? "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                    : "border-white/5 bg-white/2 text-slate-600 opacity-50 cursor-not-allowed"
                }`}
              >
                <span className="text-xl">{emoji}</span>
                <span className="text-[10px] leading-tight">{label}</span>
                {!owned && <span className="text-[9px] text-amber-500">Shop</span>}
              </button>
            );
          })}
        </div>
      </Section>

      <Section label="Accessory">
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(ACCESSORIES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => update("accessory", key)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all ${
                character.accessory === key
                  ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
              }`}
            >
              <span className="text-xl">{val.emoji || "✖️"}</span>
              <span className="text-[10px] leading-tight">{val.label}</span>
            </button>
          ))}
        </div>
      </Section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 gradient-accent text-white hover:opacity-90 disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : saved ? (
          <><Check className="w-4 h-4" /> Saved!</>
        ) : (
          "Save Character"
        )}
      </button>
    </div>
  );
});

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">{label}</p>
      {children}
    </div>
  );
}
