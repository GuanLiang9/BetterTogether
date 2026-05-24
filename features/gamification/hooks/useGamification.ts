"use client";

import { useEffect, useState, useCallback } from "react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { useAuthStore } from "@/stores/authStore";
import { useGamificationStore } from "@/stores/gamificationStore";
import { purchaseUnlockable as purchaseAction, equipUnlockable as equipAction } from "../actions/gamification.actions";
import { getXpForLevel } from "@/lib/gamification/level-thresholds";
import type { Unlockable, UserUnlockable } from "@/types/app.types";

export function useGamification() {
  const supabase = useSupabase();
  const profile = useAuthStore((s) => s.profile);
  const {
    xp, coins, level, xpToNextLevel, unlockables, userUnlockables,
    setXp, setCoins, setLevel, setXpToNextLevel,
    setUnlockables, setUserUnlockables, setShopHydratedForId,
  } = useGamificationStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [isEquipping, setIsEquipping] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.id) return;

    setXp(profile.xp);
    setCoins(profile.coins);
    setLevel(profile.level);
    const levelXpStart = getXpForLevel(profile.level);
    const levelXpEnd = getXpForLevel(profile.level + 1);
    setXpToNextLevel(levelXpEnd - levelXpStart);

    // Skip shop catalog fetch if already loaded for this user
    if (useGamificationStore.getState().shopHydratedForId === profile.id) {
      setIsLoading(false);
      return;
    }
    setShopHydratedForId(profile.id);

    async function load() {
      const [{ data: catalog }, { data: owned }] = await Promise.all([
        supabase.from("unlockables").select("*").order("level_required", { ascending: true }),
        supabase.from("user_unlockables").select("*").eq("user_id", profile!.id),
      ]);
      if (catalog) setUnlockables(catalog as Unlockable[]);
      if (owned) setUserUnlockables(owned as UserUnlockable[]);
      setIsLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const refreshOwned = useCallback(async () => {
    if (!profile?.id) return;
    const { data } = await supabase
      .from("user_unlockables")
      .select("*")
      .eq("user_id", profile.id);
    if (data) setUserUnlockables(data as UserUnlockable[]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, profile?.id]);

  const purchaseUnlockable = useCallback(
    async (unlockableId: string) => {
      setIsPurchasing(unlockableId);
      setError(null);
      const result = await purchaseAction(unlockableId);
      if (result.error) setError(result.error);
      else await refreshOwned();
      setIsPurchasing(null);
      return result;
    },
    [refreshOwned],
  );

  const equipUnlockable = useCallback(
    async (item: Unlockable) => {
      setIsEquipping(item.id);
      setError(null);
      const result = await equipAction(item.id, item.category, item.slug);
      if (result.error) setError(result.error);
      else await refreshOwned();
      setIsEquipping(null);
      return result;
    },
    [refreshOwned],
  );

  const xpInLevel = profile
    ? profile.xp - getXpForLevel(profile.level)
    : xp - getXpForLevel(level);

  return {
    xp, coins, level, xpToNextLevel, unlockables, userUnlockables,
    xpInLevel,
    isLoading, isPurchasing, isEquipping, error,
    purchaseUnlockable, equipUnlockable,
  };
}
