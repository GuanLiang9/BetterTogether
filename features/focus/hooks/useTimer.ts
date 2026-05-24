"use client";

import { useEffect, useRef, useCallback } from "react";
import { useFocusStore } from "@/stores/focusStore";
import { endFocusSession } from "../actions/focus.actions";

const POMODORO_WORK_SECS = 25 * 60;
const SHORT_BREAK_SECS = 5 * 60;
const LONG_BREAK_SECS = 15 * 60;
const ROUNDS_BEFORE_LONG = 4;

export function useTimer() {
  // Only subscribe to timerStatus — avoids re-rendering every tick
  const timerStatus = useFocusStore((s) => s.timerStatus);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const doEndSession = useCallback(async (completed: boolean, elapsedSecs?: number) => {
    clearTimer();
    const state = useFocusStore.getState();
    if (!state.activeSession) return;

    const elapsed = elapsedSecs ?? (state.totalSecs - state.remainingSecs);
    const actualMins = Math.floor(elapsed / 60);

    await endFocusSession({
      sessionId: state.activeSession.id,
      actualMins,
      plantStage: completed ? 5 : state.plantStage,
      completed,
    });

    if (completed) {
      useFocusStore.getState().completeSession();
    } else {
      useFocusStore.getState().abandonSession();
    }
  }, [clearTimer]);

  // Main timer interval
  useEffect(() => {
    if (timerStatus !== "running" && timerStatus !== "break") {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      const state = useFocusStore.getState();

      if (state.remainingSecs <= 1) {
        clearTimer();

        if (state.timerStatus === "break") {
          useFocusStore.setState({
            timerStatus: "idle",
            remainingSecs: POMODORO_WORK_SECS,
            totalSecs: POMODORO_WORK_SECS,
          });
          return;
        }

        if (state.activeSession?.mode === "pomodoro") {
          const isLongBreak = state.pomodoroRound >= ROUNDS_BEFORE_LONG;
          const breakSecs = isLongBreak ? LONG_BREAK_SECS : SHORT_BREAK_SECS;
          const elapsedSecs = state.totalSecs - state.remainingSecs;
          useFocusStore.setState({
            timerStatus: "break",
            remainingSecs: breakSecs,
            totalSecs: breakSecs,
            plantStage: 5,
            pomodoroRound: isLongBreak ? 1 : state.pomodoroRound + 1,
          });
          doEndSession(true, elapsedSecs);
        } else {
          doEndSession(true);
        }
      } else {
        useFocusStore.getState().tick();
      }
    }, 1000);

    return clearTimer;
  }, [timerStatus, clearTimer, doEndSession]);

  // Stable callbacks — don't capture store reference
  const pause = useCallback(() => {
    clearTimer();
    useFocusStore.getState().pauseSession();
  }, [clearTimer]);

  const resume = useCallback(() => {
    useFocusStore.getState().resumeSession();
  }, []);

  const abandon = useCallback(() => {
    doEndSession(false);
  }, [doEndSession]);

  return { pause, resume, abandon };
}
