"use client";

import { useEffect, useState } from "react";
import { Trees } from "lucide-react";
import { FocusTimer } from "@/features/focus/components/FocusTimer";
import { SessionControls } from "@/features/focus/components/SessionControls";
import { CoupleFocusRoom } from "@/features/focus/components/CoupleFocusRoom";
import { SessionHistoryChart } from "@/features/focus/components/SessionHistoryChart";
import { useTimer } from "@/features/focus/hooks/useTimer";
import { useFocusRealtime } from "@/features/focus/hooks/useFocusRealtime";
import { useFocusStore } from "@/stores/focusStore";
import { useAuthStore } from "@/stores/authStore";
import { useCoupleStore } from "@/stores/coupleStore";
import { getFocusHistory } from "@/features/focus/actions/focus.actions";

type SessionEntry = { started_at: string; actual_mins: number | null };

export default function FocusPage() {
  const { pause, resume, abandon } = useTimer();
  useFocusRealtime();

  const profileId = useAuthStore((s) => s.profile?.id);
  const partner = useCoupleStore((s) => s.partner);
  const timerStatus = useFocusStore((s) => s.timerStatus);
  const [history, setHistory] = useState<SessionEntry[]>([]);

  useEffect(() => {
    if (!profileId) return;
    getFocusHistory().then((data) => setHistory(data as SessionEntry[]));
  }, [profileId]);

  const isActive = timerStatus !== "idle";
  const isLinked = !!partner;

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Trees className="h-5 w-5 text-emerald-400" />
        <h1 className="text-2xl font-bold text-slate-100">Focus</h1>
      </div>

      {/* Timer ring */}
      <div className="flex flex-col items-center py-4">
        <FocusTimer />
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <div className="w-full max-w-xs">
          <SessionControls
            onPause={pause}
            onResume={resume}
            onAbandon={abandon}
          />
        </div>
      </div>

      {/* Couple focus room — only show when partner linked AND there's an active session */}
      {isLinked && isActive && <CoupleFocusRoom />}

      {/* Session history chart */}
      {history.length > 0 && <SessionHistoryChart sessions={history} />}
    </div>
  );
}
