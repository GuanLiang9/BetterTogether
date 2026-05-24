import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FocusSession, CoupleFocusSession } from "@/types/app.types";

type TimerStatus = "idle" | "running" | "paused" | "break";

interface FocusStore {
  activeSession: FocusSession | null;
  activeCoupleSession: CoupleFocusSession | null;
  partnerTimerState: { remainingSecs: number; status: TimerStatus } | null;
  sessionHistory: FocusSession[];
  timerStatus: TimerStatus;
  remainingSecs: number;
  totalSecs: number;
  plantStage: number;
  pomodoroRound: number;
  startSession: (session: FocusSession, totalSecs: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  tick: () => void;
  completeSession: () => void;
  abandonSession: () => void;
  setActiveCoupleSession: (session: CoupleFocusSession | null) => void;
  setPartnerTimer: (state: { remainingSecs: number; status: TimerStatus } | null) => void;
  setHistory: (sessions: FocusSession[]) => void;
  nextRound: () => void;
}

export const useFocusStore = create<FocusStore>()(
  persist(
    (set, get) => ({
      activeSession: null,
      activeCoupleSession: null,
      partnerTimerState: null,
      sessionHistory: [],
      timerStatus: "idle",
      remainingSecs: 0,
      totalSecs: 0,
      plantStage: 0,
      pomodoroRound: 1,
      startSession: (session, totalSecs) =>
        set({ activeSession: session, timerStatus: "running", remainingSecs: totalSecs, totalSecs, plantStage: 0 }),
      pauseSession: () => set({ timerStatus: "paused" }),
      resumeSession: () => set({ timerStatus: "running" }),
      tick: () => {
        const { remainingSecs, totalSecs } = get();
        const newSecs = Math.max(0, remainingSecs - 1);
        const pct = 1 - newSecs / totalSecs;
        const plantStage = Math.min(5, Math.floor(pct * 5));
        set({ remainingSecs: newSecs, plantStage });
      },
      completeSession: () =>
        set({ timerStatus: "idle", activeSession: null, plantStage: 5, remainingSecs: 0 }),
      abandonSession: () =>
        set({ timerStatus: "idle", activeSession: null, remainingSecs: 0, plantStage: 0 }),
      nextRound: () =>
        set((state) => ({
          timerStatus: "break",
          pomodoroRound: state.pomodoroRound + 1,
        })),
      setActiveCoupleSession: (activeCoupleSession) => set({ activeCoupleSession }),
      setPartnerTimer: (partnerTimerState) => set({ partnerTimerState }),
      setHistory: (sessionHistory) => set({ sessionHistory }),
    }),
    {
      name: "focus-store",
      partialize: (state) => ({ timerStatus: state.timerStatus }),
    },
  ),
);
