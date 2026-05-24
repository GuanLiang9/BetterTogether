"use client";
import { memo } from "react";
import { cn } from "@/lib/utils/cn";
import { useThemeStore } from "@/stores/themeStore";
import { THEME_DEFINITIONS } from "@/lib/themes/definitions";
import { Check, Lock } from "lucide-react";
import type { Unlockable, UserUnlockable } from "@/types/app.types";

interface ThemeSelectorProps {
  unlockables: Unlockable[];
  userUnlockables: UserUnlockable[];
  userLevel: number;
  userCoins: number;
  onPurchase: (id: string) => void;
  onEquip: (item: Unlockable) => void;
  isPurchasing: string | null;
  isEquipping: string | null;
}

export const ThemeSelector = memo(function ThemeSelector({
  unlockables,
  userUnlockables,
  userLevel,
  userCoins,
  onPurchase,
  onEquip,
  isPurchasing,
  isEquipping,
}: ThemeSelectorProps) {
  const activeTheme = useThemeStore((s) => s.activeTheme);

  return (
    <div className="grid grid-cols-2 gap-3">
      {THEME_DEFINITIONS.map((def) => {
        const unlockable = unlockables.find((u) => u.slug === def.id && u.category === "theme");
        const userItem = userUnlockables.find((u) => u.unlockable_id === unlockable?.id);
        const isOwned = def.coinCost === 0 || !!userItem;
        const isEquipped = activeTheme === def.id;
        const canAfford = userCoins >= def.coinCost;
        const meetsLevel = userLevel >= def.levelRequired;
        const canBuy = !isOwned && canAfford && meetsLevel;

        return (
          <button
            key={def.id}
            disabled={!isOwned && !canBuy}
            onClick={() => {
              if (isOwned && !isEquipped && unlockable) onEquip(unlockable);
              else if (canBuy && unlockable) onPurchase(unlockable.id);
            }}
            className={cn(
              "relative rounded-2xl p-4 text-left transition-all",
              isEquipped ? "border-2" : "border",
              isOwned ? "opacity-100" : meetsLevel ? "opacity-80" : "opacity-50",
            )}
            style={{
              background: `linear-gradient(135deg, ${def.bgPreview}, ${def.bgPreview}dd)`,
              borderColor: isEquipped ? def.accentFrom : "rgba(255,255,255,0.1)",
            }}
          >
            {isEquipped && (
              <div
                className="absolute top-2 right-2 h-5 w-5 rounded-full flex items-center justify-center"
                style={{ background: def.accentFrom }}
              >
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
            {!isOwned && !canBuy && (
              <div className="absolute top-2 right-2">
                <Lock className="h-4 w-4 text-slate-500" />
              </div>
            )}
            <div className="flex gap-1.5 mb-2">
              <div className="h-3 w-3 rounded-full" style={{ background: def.accentFrom }} />
              <div className="h-3 w-3 rounded-full" style={{ background: def.accentTo }} />
            </div>
            <p className="text-xs font-bold text-white">
              {def.emoji} {def.name}
            </p>
            <p className="text-[10px] text-white/50 mt-0.5">{def.description}</p>
            {!isOwned && (
              <div className="mt-2 flex items-center gap-1 text-[10px]">
                {!meetsLevel && <span className="text-slate-400">Lv.{def.levelRequired}</span>}
                {def.coinCost > 0 && <span className="text-amber-400">🪙 {def.coinCost}</span>}
              </div>
            )}
            {isOwned && !isEquipped && (
              <p className="mt-2 text-[10px] text-white/40">Tap to equip</p>
            )}
            {isEquipped && (
              <p className="mt-2 text-[10px] font-medium" style={{ color: def.accentFrom }}>
                Active
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
});
