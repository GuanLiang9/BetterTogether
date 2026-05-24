"use client";

import { useState } from "react";
import { X, Lock } from "lucide-react";
import { FURNITURE_CATALOG } from "@/types/home.types";
import { useGamificationStore } from "@/stores/gamificationStore";
import { useHomeStore } from "@/stores/homeStore";
import { placeItem } from "@/features/home/actions/home.actions";

interface FurniturePickerProps {
  homeKey: string;
  cell: { x: number; y: number };
  onClose: () => void;
}

export function FurniturePicker({ homeKey, cell, onClose }: FurniturePickerProps) {
  const [placing, setPlacing] = useState<string | null>(null);
  const userUnlockables = useGamificationStore((s) => s.userUnlockables);
  const unlockables = useGamificationStore((s) => s.unlockables);
  const { addPlacement } = useHomeStore();

  const ownedSlugs = new Set(userUnlockables.map((u) => u.unlockable_id));
  const furnitureItems = unlockables.filter((u) => u.category === "furniture");

  async function handlePlace(slug: string, emoji: string, label: string) {
    setPlacing(slug);
    try {
      const result = await placeItem(homeKey, slug, emoji, label, cell.x, cell.y);
      addPlacement(result as Parameters<typeof addPlacement>[0]);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setPlacing(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-t-3xl p-5 pb-safe animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200">
            Place at ({cell.x}, {cell.y})
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
          {Object.entries(FURNITURE_CATALOG).map(([slug, info]) => {
            const unlockable = furnitureItems.find((u) => u.slug === slug);
            const owned = unlockable ? ownedSlugs.has(unlockable.id) : false;
            const isPlacing = placing === slug;

            return (
              <button
                key={slug}
                onClick={() => owned && handlePlace(slug, info.emoji, info.label)}
                disabled={!owned || !!placing}
                className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                  owned
                    ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                    : "border-white/5 bg-white/2 opacity-50 cursor-not-allowed"
                } ${isPlacing ? "scale-95" : ""}`}
              >
                <span className="text-2xl leading-none">{info.emoji}</span>
                <span className="text-[10px] text-slate-400 text-center leading-tight">{info.label}</span>
                {!owned && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20">
                    <Lock className="w-3 h-3 text-slate-500" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-center text-xs text-slate-600">
          Unlock furniture in the Shop with coins
        </p>
      </div>
    </div>
  );
}
