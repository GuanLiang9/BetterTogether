"use client";

import { useCallback, useEffect } from "react";
import { useHomeStore } from "@/stores/homeStore";
import { useCoupleStore } from "@/stores/coupleStore";
import { useAuthStore } from "@/stores/authStore";
import { getOrCreateHome, getHomePlacements } from "@/features/home/actions/home.actions";

export function useHome() {
  const coupleId = useCoupleStore((s) => s.couple?.id);
  const profileId = useAuthStore((s) => s.profile?.id);
  // Solo users get their own home; coupled users share one keyed on couple_id
  const homeKey = coupleId ?? profileId;

  const { home, placements, isLoading, hydratedForId, setHome, setPlacements, setLoading, setHydratedForId } =
    useHomeStore();

  const hydrate = useCallback(async () => {
    if (!homeKey) return;
    if (hydratedForId === homeKey) return;
    setLoading(true);
    try {
      const [homeData, placementsData] = await Promise.all([
        getOrCreateHome(homeKey),
        getHomePlacements(homeKey),
      ]);
      setHome(homeData as Parameters<typeof setHome>[0]);
      setPlacements(placementsData as Parameters<typeof setPlacements>[0]);
      setHydratedForId(homeKey);
    } finally {
      setLoading(false);
    }
  }, [homeKey, hydratedForId, setHome, setPlacements, setLoading, setHydratedForId]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return { home, placements, isLoading, homeKey: homeKey ?? "", refetch: hydrate };
}
