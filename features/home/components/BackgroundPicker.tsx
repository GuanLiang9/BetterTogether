"use client";

import { useState, memo } from "react";
import { HOME_BACKGROUNDS } from "@/types/home.types";
import { useHomeStore } from "@/stores/homeStore";
import { useHome } from "@/features/home/hooks/useHome";
import { updateBackground } from "@/features/home/actions/home.actions";

export const BackgroundPicker = memo(function BackgroundPicker() {
  const background = useHomeStore((s) => s.home?.background ?? "cozy");
  const updateLocalBg = useHomeStore((s) => s.updateBackground);
  const { homeKey } = useHome();
  const [saving, setSaving] = useState(false);

  async function handleSelect(key: string) {
    if (!homeKey || saving) return;
    setSaving(true);
    updateLocalBg(key);
    try {
      await updateBackground(homeKey, key);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Room Theme</p>
      <div className="flex gap-2 flex-wrap">
        {Object.entries(HOME_BACKGROUNDS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            disabled={saving}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              background === key
                ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
            }`}
          >
            {val.label}
          </button>
        ))}
      </div>
    </div>
  );
});
