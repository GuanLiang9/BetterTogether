# Focus Feature

## Responsibility
Pomodoro/freeform focus timer with plant growth animation, shared couple focus sessions, and session history with Recharts stats.

## Key Files
- `components/FocusTimer.tsx` — SVG circular countdown, reads focusStore.remainingSecs
- `components/PlantAnimation.tsx` — CSS custom property --growth-pct drives SVG path morph; stage 0-5
- `components/SessionControls.tsx` — start/pause/stop buttons
- `components/CoupleFocusRoom.tsx` — shown when activeCoupleSession exists; both partner timers
- `components/SessionHistoryChart.tsx` — Recharts bar chart of weekly focus time
- `hooks/useTimer.ts` — manages setInterval, dispatches focusStore.tick() every second
- `hooks/useFocusRealtime.ts` — sends FOCUS_SESSION_TICK broadcast every 5s; receives partner tick
- `actions/focus.actions.ts` — startSession, endSession, createCoupleSession, joinCoupleSession

## Rules
- Timer runs CLIENT-SIDE only (setInterval in useTimer.ts). Server only records start/end times.
- PlantAnimation grows based on focusStore.plantStage (0-5), updated every 20% of session completion.
- On session complete: endSession Server Action → DB trigger awards XP/coins → gamificationStore updates via profile Postgres Change.
- Abandoned sessions (< 5 mins actual) earn 0 XP.
- FOCUS_SESSION_TICK broadcast is ephemeral. Do NOT persist tick data.
- Partner timer in CoupleFocusRoom uses focusStore.partnerTimerState set by useFocusRealtime.

## Timer Modes
- Pomodoro: 25m work → 5m break, auto-cycle up to 4 rounds → 15m long break
- Freeform: user sets 5-120 min duration
