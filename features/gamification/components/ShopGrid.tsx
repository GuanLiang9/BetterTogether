"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { UnlockableCard } from "./UnlockableCard";
import { useGamification } from "../hooks/useGamification";
import { useCoupleStore } from "@/stores/coupleStore";
import { useAuthStore } from "@/stores/authStore";
import type { Unlockable } from "@/types/app.types";

const TABS = [
  { key: "all", label: "All" },
  { key: "theme", label: "Themes" },
  { key: "plant_skin", label: "Plants" },
  { key: "badge", label: "Badges" },
  { key: "reaction", label: "Reactions" },
] as const;

type TabKey = typeof TABS[number]["key"];

export function ShopGrid() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const partner = useCoupleStore((s) => s.partner);
  const profile = useAuthStore((s) => s.profile);
  const {
    unlockables,
    userUnlockables,
    isLoading,
    isPurchasing,
    isEquipping,
    error,
    purchaseUnlockable,
    equipUnlockable,
  } = useGamification();

  const isLinked = !!partner;

  const filtered: Unlockable[] = unlockables.filter((item) =>
    activeTab === "all" ? true : item.category === activeTab,
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all border",
              activeTab === key
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-white/5 text-slate-400 border-white/8 hover:bg-white/8 hover:text-slate-300",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="glass rounded-2xl px-4 py-3 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-sm text-slate-500">Nothing in this category yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((item) => {
            const userItem = userUnlockables.find((u) => u.unlockable_id === item.id);
            return (
              <UnlockableCard
                key={item.id}
                item={item}
                userItem={userItem}
                userLevel={profile?.level ?? 1}
                userXp={profile?.xp ?? 0}
                userCoins={profile?.coins ?? 0}
                isLinked={isLinked}
                onPurchase={purchaseUnlockable}
                onEquip={equipUnlockable}
                isPurchasing={isPurchasing === item.id}
                isEquipping={isEquipping === item.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
