"use client";

import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/stores/authStore";
import { useCoupleStore } from "@/stores/coupleStore";
import { useFocusStore } from "@/stores/focusStore";

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function CoupleFocusRoom() {
  const profile = useAuthStore((s) => s.profile);
  const partner = useCoupleStore((s) => s.partner);
  const { remainingSecs, totalSecs, timerStatus, partnerTimerState } = useFocusStore();

  const myPct = totalSecs > 0 ? (1 - remainingSecs / totalSecs) * 100 : 0;
  const partnerPct = partnerTimerState
    ? ((totalSecs - partnerTimerState.remainingSecs) / Math.max(totalSecs, 1)) * 100
    : 0;

  const statusColor = {
    running: "text-emerald-400",
    paused: "text-amber-400",
    break: "text-indigo-400",
    idle: "text-slate-500",
  };

  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-xs text-slate-500 uppercase tracking-widest text-center mb-3">Focus Room</p>
      <div className="grid grid-cols-2 gap-4">
        {/* Me */}
        <div className="flex flex-col items-center gap-2">
          <Avatar src={profile?.avatar_url} name={profile?.display_name} size="sm" />
          <p className="text-xs text-slate-300 font-medium truncate max-w-[6rem] text-center">
            {profile?.display_name ?? "You"}
          </p>
          <span className={`text-lg font-bold tabular-nums ${statusColor[timerStatus]}`}>
            {formatTime(remainingSecs)}
          </span>
          {/* Mini progress bar */}
          <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
              style={{ width: `${myPct}%` }}
            />
          </div>
        </div>

        {/* Partner */}
        <div className="flex flex-col items-center gap-2">
          <Avatar src={partner?.avatar_url} name={partner?.display_name} size="sm" />
          <p className="text-xs text-slate-300 font-medium truncate max-w-[6rem] text-center">
            {partner?.display_name ?? "Partner"}
          </p>
          {partnerTimerState ? (
            <>
              <span className={`text-lg font-bold tabular-nums ${statusColor[partnerTimerState.status]}`}>
                {formatTime(partnerTimerState.remainingSecs)}
              </span>
              <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-1000"
                  style={{ width: `${Math.min(100, partnerPct)}%` }}
                />
              </div>
            </>
          ) : (
            <span className="text-xs text-slate-600">Not focusing</span>
          )}
        </div>
      </div>
    </div>
  );
}
