import { create } from "zustand";
import type { CoupleLink, Profile, ReactionEvent } from "@/types/app.types";

interface CoupleStore {
  couple: CoupleLink | null;
  partner: Profile | null;
  partnerOnline: boolean;
  partnerLastSeen: Date | null;
  pendingReactions: ReactionEvent[];
  setCouple: (couple: CoupleLink | null) => void;
  setPartner: (partner: Profile | null) => void;
  setPartnerOnline: (online: boolean) => void;
  addReaction: (reaction: ReactionEvent) => void;
  removeReaction: (id: string) => void;
  updateCoupleXp: (xp: number) => void;
}

export const useCoupleStore = create<CoupleStore>((set) => ({
  couple: null,
  partner: null,
  partnerOnline: false,
  partnerLastSeen: null,
  pendingReactions: [],
  setCouple: (couple) => set({ couple }),
  setPartner: (partner) => set({ partner }),
  setPartnerOnline: (online) =>
    set({ partnerOnline: online, partnerLastSeen: online ? null : new Date() }),
  addReaction: (reaction) =>
    set((state) => ({ pendingReactions: [...state.pendingReactions, reaction] })),
  removeReaction: (id) =>
    set((state) => ({
      pendingReactions: state.pendingReactions.filter((r) => r.id !== id),
    })),
  updateCoupleXp: (xp) =>
    set((state) => ({
      couple: state.couple ? { ...state.couple, couple_xp: xp } : null,
    })),
}));
