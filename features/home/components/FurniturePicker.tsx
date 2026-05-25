"use client";

import { useState } from "react";
import { X, Lock, Coins } from "lucide-react";
import { FurnitureIcon } from "./FurnitureIcon";
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

  const ownedIds = new Set(userUnlockables.map((u) => u.unlockable_id));
  const furnitureItems = unlockables.filter((u) => u.category === "furniture");

  async function handlePlace(slug: string, label: string) {
    setPlacing(slug);
    try {
      const result = await placeItem(homeKey, slug, slug, label, cell.x, cell.y);
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
          <h3 className="text-sm font-semibold text-slate-200">Place furniture</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {furnitureItems.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-6">
            No furniture in your catalog yet — visit the Shop!
          </p>
        )}

        <div className="grid grid-cols-4 gap-2 max-h-72 overflow-y-auto">
          {furnitureItems.map((item) => {
            const owned = ownedIds.has(item.id);
            const isPlacing = placing === item.slug;

            return (
              <button
                key={item.slug}
                onClick={() => owned && !placing && handlePlace(item.slug, item.name)}
                disabled={!owned || !!placing}
                className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                  owned
                    ? isPlacing
                      ? "border-emerald-500/40 bg-emerald-500/10 scale-95"
                      : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                    : "border-white/5 bg-white/3 opacity-50 cursor-not-allowed"
                }`}
              >
                <FurnitureIcon slug={item.slug} size={44} />
                <span className="text-[10px] text-slate-300 text-center leading-tight font-medium">
                  {item.name}
                </span>
                {!owned && (
                  <>
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/30">
                      <Lock className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                      <span className="text-[9px] text-amber-400 flex items-center gap-0.5">
                        <Coins className="w-2.5 h-2.5" />
                        {item.coin_cost}
                      </span>
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-center text-xs text-slate-600">
          Unlock furniture in the Shop · {ownedIds.size} owned
        </p>
      </div>
    </div>
  );
}
