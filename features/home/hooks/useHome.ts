"use client";

import { useCallback, useEffect } from "react";
import { useHomeStore } from "@/stores/homeStore";
import { useCoupleStore } from "@/stores/coupleStore";
import { getOrCreateHome, getHomePlacements } from "@/features/home/actions/home.actions";

export function useHome() {
  const couple = useCoupleStore((s) => s.couple);
  const { home, placements, isLoading, hydratedForId, setHome, setPlacements, setLoading, setHydratedForId } =
    useHomeStore();

  const hydrate = useCallback(async () => {
    if (!couple?.id) return;
    if (hydratedForId === couple.id) return;
    setLoading(true);
    try {
      const [homeData, placementsData] = await Promise.all([
        getOrCreateHome(couple.id),
        getHomePlacements(couple.id),
      ]);
      setHome(homeData as Parameters<typeof setHome>[0]);
      setPlacements(placementsData as Parameters<typeof setPlacements>[0]);
      setHydratedForId(couple.id);
    } finally {
      setLoading(false);
    }
  }, [couple?.id, hydratedForId, setHome, setPlacements, setLoading, setHydratedForId]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return { home, placements, isLoading, refetch: hydrate };
}
