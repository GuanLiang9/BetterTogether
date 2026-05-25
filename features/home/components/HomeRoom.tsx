"use client";

import { useState, useMemo, memo, lazy, Suspense } from "react";
import { Trash2, Plus } from "lucide-react";
import { useHomeStore } from "@/stores/homeStore";
import { useCoupleStore } from "@/stores/coupleStore";
import { useAuthStore } from "@/stores/authStore";
import { HOME_BACKGROUNDS } from "@/types/home.types";
import { removeItem } from "@/features/home/actions/home.actions";
import { useHome } from "@/features/home/hooks/useHome";
import type { HomePlacement } from "@/types/home.types";
import { FurnitureIcon } from "./FurnitureIcon";

// Lazy-load the picker — it imports the full furniture catalog and unlockables store
const FurniturePicker = lazy(() =>
  import("./FurniturePicker").then((m) => ({ default: m.FurniturePicker })),
);

const COLS = 8;
const ROWS = 6;

export const HomeRoom = memo(function HomeRoom() {
  const home = useHomeStore((s) => s.home);
  const placements = useHomeStore((s) => s.placements);
  const removePlacement = useHomeStore((s) => s.removePlacement);
  const couple = useCoupleStore((s) => s.couple);
  const partner = useCoupleStore((s) => s.partner);
  const partnerOnline = useCoupleStore((s) => s.partnerOnline);
  const displayName = useAuthStore((s) => s.profile?.display_name);
  const { homeKey } = useHome();

  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  // Memoize lookup map so it's not recreated on every render
  const placementMap = useMemo(() => {
    const map = new Map<string, HomePlacement>();
    for (const p of placements) map.set(`${p.grid_x},${p.grid_y}`, p);
    return map;
  }, [placements]);

  const bg = home?.background ?? "cozy";
  const bgStyle = HOME_BACKGROUNDS[bg] ?? HOME_BACKGROUNDS.cozy;

  async function handleRemove(placement: HomePlacement, e: React.MouseEvent) {
    e.stopPropagation();
    setRemoving(placement.id);
    try {
      await removeItem(placement.id);
      removePlacement(placement.id);
    } finally {
      setRemoving(null);
    }
  }

  function handleCellClick(x: number, y: number) {
    if (!placementMap.has(`${x},${y}`)) {
      setSelectedCell({ x, y });
      setPickerOpen(true);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Residents bar */}
      <div className="flex items-center gap-2 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs">
            {displayName?.[0]?.toUpperCase() ?? "Y"}
          </div>
          <span className="text-xs text-slate-400">You</span>
        </div>
        <div className="h-px flex-1 bg-white/5" />
        {couple && partner ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">{partner.display_name}</span>
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-xs">
                {partner.display_name?.[0]?.toUpperCase() ?? "P"}
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-900 ${
                  partnerOnline ? "bg-emerald-400" : "bg-slate-600"
                }`}
              />
            </div>
          </div>
        ) : (
          <span className="text-xs text-slate-600 italic">
            {couple ? "Partner not linked yet" : "Link a partner to share this space"}
          </span>
        )}
      </div>

      {/* Room grid */}
      <div
        className={`relative rounded-2xl overflow-hidden border border-white/8 bg-gradient-to-br ${bgStyle.gradient}`}
        style={{ minHeight: 280 }}
      >
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            minHeight: 280,
          }}
        >
          {Array.from({ length: ROWS }, (_, y) =>
            Array.from({ length: COLS }, (_, x) => {
              const placement = placementMap.get(`${x},${y}`);
              return (
                <div
                  key={`${x},${y}`}
                  onClick={() => handleCellClick(x, y)}
                  className={`relative border border-white/4 flex items-center justify-center cursor-pointer group transition-all duration-150 ${
                    placement ? "" : "hover:bg-white/5"
                  }`}
                >
                  {placement ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <FurnitureIcon slug={placement.item_slug} size={34} />
                      <button
                        onClick={(e) => handleRemove(placement, e)}
                        disabled={removing === placement.id}
                        className="absolute top-0 right-0 p-0.5 rounded bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-2.5 h-2.5 text-red-400" />
                      </button>
                    </div>
                  ) : (
                    <Plus className="w-3 h-3 text-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>

      <p className="text-center text-xs text-slate-600">
        Tap any empty cell to place furniture · {placements.length}/{COLS * ROWS} spots filled
      </p>

      {pickerOpen && selectedCell && homeKey && (
        <Suspense fallback={null}>
          <FurniturePicker
            homeKey={homeKey}
            cell={selectedCell}
            onClose={() => {
              setPickerOpen(false);
              setSelectedCell(null);
            }}
          />
        </Suspense>
      )}
    </div>
  );
});
