import { create } from "zustand";
import type { CoupleHome, HomePlacement } from "@/types/home.types";

interface HomeStore {
  home: CoupleHome | null;
  placements: HomePlacement[];
  isLoading: boolean;
  hydratedForId: string | null;
  setHome: (home: CoupleHome) => void;
  setPlacements: (placements: HomePlacement[]) => void;
  addPlacement: (placement: HomePlacement) => void;
  removePlacement: (id: string) => void;
  updateBackground: (background: string) => void;
  setLoading: (loading: boolean) => void;
  setHydratedForId: (id: string) => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
  home: null,
  placements: [],
  isLoading: false,
  hydratedForId: null,
  setHome: (home) => set({ home }),
  setPlacements: (placements) => set({ placements }),
  addPlacement: (placement) =>
    set((state) => ({
      placements: [
        ...state.placements.filter(
          (p) => !(p.grid_x === placement.grid_x && p.grid_y === placement.grid_y),
        ),
        placement,
      ],
    })),
  removePlacement: (id) =>
    set((state) => ({ placements: state.placements.filter((p) => p.id !== id) })),
  updateBackground: (background) =>
    set((state) => (state.home ? { home: { ...state.home, background } } : {})),
  setLoading: (isLoading) => set({ isLoading }),
  setHydratedForId: (id) => set({ hydratedForId: id }),
}));
