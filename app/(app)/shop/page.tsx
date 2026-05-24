"use client";

import { ShoppingBag } from "lucide-react";
import { ShopGrid } from "@/features/gamification/components/ShopGrid";
import { CoinDisplay } from "@/features/gamification/components/CoinDisplay";
import { ThemeSelector } from "@/features/gamification/components/ThemeSelector";
import { useGamification } from "@/features/gamification/hooks/useGamification";
import { useAuthStore } from "@/stores/authStore";

export default function ShopPage() {
  const profile = useAuthStore((s) => s.profile);
  const {
    unlockables,
    userUnlockables,
    isLoading,
    isPurchasing,
    isEquipping,
    purchaseUnlockable,
    equipUnlockable,
  } = useGamification();

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-amber-400" />
          <h1 className="text-2xl font-bold text-slate-100">Shop</h1>
        </div>
        <CoinDisplay />
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Spend coins to unlock themes and customizations. Earn them by completing habits and focus sessions.
      </p>

      {/* Themes section */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Themes</h2>
        {!isLoading && (
          <ThemeSelector
            unlockables={unlockables}
            userUnlockables={userUnlockables}
            userLevel={profile?.level ?? 1}
            userCoins={profile?.coins ?? 0}
            onPurchase={purchaseUnlockable}
            onEquip={equipUnlockable}
            isPurchasing={isPurchasing}
            isEquipping={isEquipping}
          />
        )}
      </section>

      {/* Full shop grid */}
      <ShopGrid />
    </div>
  );
}
