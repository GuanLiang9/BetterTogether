# Habits Feature

## Responsibility
Full CRUD for habits, daily completion tracking, streak computation, partner habit visibility, and history visualization.

## Key Files
- `components/HabitCard.tsx` — icon, title, streak flame, checkbox, XP badge
- `components/HabitCheckbox.tsx` — spring-animated checkmark; optimistic update on click
- `components/HabitForm.tsx` — create/edit form (react-hook-form + zod)
- `components/HabitHistory.tsx` — Recharts calendar heatmap (last 90 days)
- `components/PartnerHabitRow.tsx` — read-only partner habit status
- `hooks/useHabits.ts` — reads habitsStore, handles completeHabit/uncompleteHabit with optimistic updates
- `hooks/useHabitRealtime.ts` — Postgres Changes for partner habit_completions
- `actions/habits.actions.ts` — createHabit, updateHabit, archiveHabit, completeHabit, uncompleteHabit

## Rules
- Completion is date-scoped. ALWAYS use the user's local date from `profiles.timezone`, not UTC.
- Optimistic updates: update habitsStore immediately, revert on Server Action error.
- `completeHabit` Server Action: INSERT habit_completions → DB trigger handles XP/streak/couple_streak.
- NEVER manually update xp_ledger or habit_streaks from client code. DB triggers own that.
- Shared habits (is_shared=true) show a partner status indicator via partnerCompletions from habitsStore.
- Archive (soft delete) habits instead of hard deleting. Filter archived from default list.

## Realtime
- useHabitRealtime subscribes to habit_completions Postgres Changes for couple's shared habits.
- On INSERT from partner: habitsStore.setPartnerCompletion(habitId, true) + trigger XpToast (+5 XP sympathy).
