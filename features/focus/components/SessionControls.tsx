"use client";

import { useState } from "react";
import { Play, Pause, Square, Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useFocusStore } from "@/stores/focusStore";
import { startFocusSession } from "../actions/focus.actions";
import { useAuthStore } from "@/stores/authStore";
import type { FocusSession } from "@/types/app.types";

const POMODORO_SECS = 25 * 60;
const FREEFORM_OPTIONS = [5, 10, 15, 20, 30, 45, 60, 90];

interface SessionControlsProps {
  onPause: () => void;
  onResume: () => void;
  onAbandon: () => void;
}

export function SessionControls({ onPause, onResume, onAbandon }: SessionControlsProps) {
  const { timerStatus, startSession } = useFocusStore();
  const profile = useAuthStore((s) => s.profile);
  const [mode, setMode] = useState<"pomodoro" | "freeform">("pomodoro");
  const [freeformMins, setFreeformMins] = useState(25);
  const [isStarting, setIsStarting] = useState(false);

  const isIdle = timerStatus === "idle";
  const isRunning = timerStatus === "running";
  const isPaused = timerStatus === "paused";
  const isBreak = timerStatus === "break";

  async function handleStart() {
    if (!profile) return;
    setIsStarting(true);
    const durationMins = mode === "pomodoro" ? 25 : freeformMins;
    const result = await startFocusSession({ durationMins, mode });
    setIsStarting(false);
    if (result?.data) {
      const totalSecs = durationMins * 60;
      startSession(result.data as FocusSession, totalSecs);
    }
  }

  if (isBreak) {
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-indigo-300">Take a breather 🧘</p>
        <Button variant="ghost" onClick={onAbandon} size="sm">
          Skip break
        </Button>
      </div>
    );
  }

  if (isRunning || isPaused) {
    return (
      <div className="flex items-center gap-3">
        {isRunning ? (
          <Button variant="glass" onClick={onPause} className="gap-2">
            <Pause className="h-4 w-4" /> Pause
          </Button>
        ) : (
          <Button onClick={onResume} className="gap-2">
            <Play className="h-4 w-4" /> Resume
          </Button>
        )}
        <Button variant="danger" onClick={onAbandon} className="gap-2">
          <Square className="h-4 w-4" /> Stop
        </Button>
      </div>
    );
  }

  // Idle state — show mode + duration selector
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Mode tabs */}
      <div className="glass rounded-2xl p-1 flex gap-1">
        {(["pomodoro", "freeform"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-xl py-2 text-sm font-medium transition-all ${
              mode === m
                ? "bg-emerald-500/20 text-emerald-300"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {m === "pomodoro" ? "🍅 Pomodoro" : "⏱ Freeform"}
          </button>
        ))}
      </div>

      {mode === "freeform" && (
        <div>
          <p className="text-xs text-slate-500 mb-2 text-center">Duration</p>
          <div className="grid grid-cols-4 gap-2">
            {FREEFORM_OPTIONS.map((mins) => (
              <button
                key={mins}
                onClick={() => setFreeformMins(mins)}
                className={`rounded-xl py-2 text-sm font-medium transition-all ${
                  freeformMins === mins
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                    : "glass text-slate-400 hover:text-slate-200"
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "pomodoro" && (
        <p className="text-center text-xs text-slate-600">
          25 min focus → 5 min break × 4, then 15 min long break
        </p>
      )}

      <Button onClick={handleStart} loading={isStarting} className="gap-2 w-full">
        <Play className="h-4 w-4" />
        Start session
      </Button>
    </div>
  );
}
