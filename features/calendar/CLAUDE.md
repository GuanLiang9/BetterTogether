# Calendar Feature

## Responsibility
Shared couple calendar: create/edit/delete events, month/week views, countdown banner for next upcoming event, and push notification reminders.

## Key Files
- `components/CalendarGrid.tsx` — month view, day cells with event dots
- `components/WeekView.tsx` — time-slotted week grid
- `components/EventCard.tsx` — event preview card
- `components/EventForm.tsx` — create/edit form with reminder time picker
- `components/CountdownBanner.tsx` — "X days until [next event]" shown on dashboard
- `hooks/useCalendar.ts` — reads calendarStore, exposes createEvent/updateEvent/deleteEvent
- `hooks/useCalendarRealtime.ts` — Postgres Changes on events for couple_id
- `actions/calendar.actions.ts` — createEvent, updateEvent, deleteEvent, setReminder

## Rules
- All events require couple_id. Solo events do not exist in MVP.
- Reminder creation: INSERT into reminders with UTC remind_at. Push is sent by Edge Function only.
- Do NOT use Web Push API directly from Server Actions. Push = Edge Function only.
- Event times stored UTC. Display in user's profile.timezone using date-fns-tz.
- Recurring events use RRULE strings. Render next 3 occurrences only — never expand infinitely.
- CalendarGrid filters calendarStore.events to the visible month range only.

## Realtime
- useCalendarRealtime handles events Postgres Changes (INSERT/UPDATE/DELETE).
- No manual broadcast needed — Postgres Changes is sufficient (events are immediately persisted).
