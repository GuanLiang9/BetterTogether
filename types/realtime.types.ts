export const REALTIME_EVENTS = {
  HABIT_COMPLETED: "habit.completed",
  HABIT_UNCOMPLETED: "habit.uncompleted",
  FOCUS_SESSION_STARTED: "focus.session.started",
  FOCUS_SESSION_TICK: "focus.session.tick",
  FOCUS_SESSION_ENDED: "focus.session.ended",
  REACTION_SENT: "couple.reaction",
  NUDGE_SENT: "couple.nudge",
  CALENDAR_EVENT_UPSERTED: "calendar.event.upserted",
  CALENDAR_EVENT_DELETED: "calendar.event.deleted",
  PARTNER_ONLINE: "partner.presence",
} as const;

export type RealtimeEventType = (typeof REALTIME_EVENTS)[keyof typeof REALTIME_EVENTS];

export type HabitCompletedPayload = {
  habitId: string;
  userId: string;
  date: string;
};

export type FocusTickPayload = {
  sessionId: string;
  remainingSecs: number;
  status: "running" | "paused" | "break";
};

export type ReactionPayload = {
  emoji: string;
  fromUserId: string;
  fromDisplayName: string;
  id: string;
};

export type NudgePayload = {
  message: string;
  fromDisplayName: string;
};
