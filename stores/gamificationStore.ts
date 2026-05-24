import { create } from "zustand";
import type { Unlockable, UserUnlockable, XpLedgerEntry } from "@/types/app.types";

interface GamificationStore {
  xp: number;
  coins: number;
  level: number;
  xpToNextLevel: number;
  pendingXpGain: number | null;
  pendingCoinGain: number | null;
  pendingLevelUp: boolean;
  newLevel: number | null;
  unlockables: Unlockable[];
  userUnlockables: UserUnlockable[];
  recentLedger: XpLedgerEntry[];
  shopHydratedForId: string | null;
  setXp: (xp: number) => void;
  setCoins: (coins: number) => void;
  setLevel: (level: number) => void;
  setXpToNextLevel: (xp: number) => void;
  triggerXpGain: (amount: number) => void;
  clearPendingXpGain: () => void;
  triggerCoinGain: (amount: number) => void;
  clearPendingCoinGain: () => void;
  triggerLevelUp: (newLevel: number) => void;
  clearLevelUp: () => void;
  setUnlockables: (items: Unlockable[]) => void;
  addUserUnlockable: (item: UserUnlockable) => void;
  setUserUnlockables: (items: UserUnlockable[]) => void;
  spendCoins: (amount: number) => void;
  setRecentLedger: (entries: XpLedgerEntry[]) => void;
  setShopHydratedForId: (id: string) => void;
}

export const useGamificationStore = create<GamificationStore>((set) => ({
  xp: 0,
  coins: 0,
  level: 1,
  xpToNextLevel: 150,
  pendingXpGain: null,
  pendingCoinGain: null,
  pendingLevelUp: false,
  newLevel: null,
  unlockables: [],
  userUnlockables: [],
  recentLedger: [],
  shopHydratedForId: null,
  setXp: (xp) => set({ xp }),
  setCoins: (coins) => set({ coins }),
  setLevel: (level) => set({ level }),
  setXpToNextLevel: (xpToNextLevel) => set({ xpToNextLevel }),
  triggerXpGain: (amount) => set({ pendingXpGain: amount }),
  clearPendingXpGain: () => set({ pendingXpGain: null }),
  triggerCoinGain: (amount) => set({ pendingCoinGain: amount }),
  clearPendingCoinGain: () => set({ pendingCoinGain: null }),
  triggerLevelUp: (newLevel) => set({ pendingLevelUp: true, newLevel }),
  clearLevelUp: () => set({ pendingLevelUp: false, newLevel: null }),
  setUnlockables: (unlockables) => set({ unlockables }),
  addUserUnlockable: (item) =>
    set((state) => ({ userUnlockables: [...state.userUnlockables, item] })),
  setUserUnlockables: (userUnlockables) => set({ userUnlockables }),
  spendCoins: (amount) => set((state) => ({ coins: Math.max(0, state.coins - amount) })),
  setRecentLedger: (recentLedger) => set({ recentLedger }),
  setShopHydratedForId: (id) => set({ shopHydratedForId: id }),
}));
