# Better Together

A couples productivity and self-improvement app that makes building good habits feel like a game you play with your partner.

---

## Features

### Habit Tracking
- Create daily, weekday, or custom-frequency habits
- One-tap completion with streak tracking
- See your partner's completions in realtime
- Soft-delete only — no data lost

### Pomodoro Focus Timer
- Freeform or Pomodoro mode
- Forest-style plant that grows as you focus
- Sync focus sessions with your partner (couple mode)
- XP and coins awarded on completion via DB triggers

### Shared Calendar
- Create events for just you or both of you
- Recurring event support
- Push notification reminders (via Edge Function + Web Push)
- Timezone-aware display using `profiles.timezone`

### Gamification
- **XP & Levels** — earned from habits, focus sessions, and daily quests
- **Coins** — spend in the shop on themes, outfits, and accessories
- **Daily Quests** — reset every day; complete habits and focus sessions to claim rewards
- **Achievements** — one-time milestones tracked across habits, streaks, focus, and levels
- **Shop** — unlock color themes, plant skins, badges, reactions, and furniture

### Color Themes
Eight unlockable app-wide themes that change the accent gradient and glass tint:
`Default` · `Midnight` · `Rose` · `Ocean` · `Amber` · `Neon` · `Lavender` · `Crimson`

### Character Customization
Build a pixel-style character with skin tone, hair style, hair color, outfit, and accessory. Outfits unlock via the shop.

### Couple Home
A shared virtual space where you can place and arrange unlocked furniture items together.

### Realtime Sync
- Partner online/offline presence
- Habit completion events
- Focus timer state
- Reactions and nudges between partners

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 App Router + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first via `@theme {}`) |
| Backend | Supabase (Auth · PostgreSQL · Realtime · Edge Functions) |
| State | Zustand v5 (6 feature-scoped stores with `persist`) |
| Forms | react-hook-form + zod |
| Charts | Recharts |
| Animation | Framer Motion + Tailwind custom keyframes |
| Dates | date-fns + date-fns-tz |
| Icons | lucide-react |

---

## Project Structure

```
app/
  (auth)/           # login, signup, onboarding
  (app)/            # authenticated shell (TopBar + BottomNav)
    dashboard/
    habits/
    focus/
    calendar/
    partner/
    quests/
    character/
    achievements/
    home/
    shop/
    settings/
  api/auth/callback/ # Supabase OAuth callback

components/
  layout/           # TopBar, BottomNav
  providers/        # SupabaseProvider, ThemeProvider, RealtimeProvider, ToastProvider
  ui/               # Button, Card, Modal, Toast, etc.

features/
  habits/           # components, hooks, actions
  focus/            # components, hooks, actions
  calendar/         # components, hooks, actions
  gamification/     # ThemeSelector, shop components
  quests/           # QuestCard, QuestPanel, AchievementPanel
  character/        # CharacterBuilder, CharacterPreview, CharacterCard
  couple/           # partner linking, reactions, home

stores/             # Zustand stores (auth, habits, focus, calendar, gamification, quests, character, theme, home)
lib/                # supabase clients, realtime helpers, theme definitions, quest definitions
types/              # database.types.ts, app.types.ts, realtime.types.ts, etc.
supabase/           # migrations, edge functions
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- A Supabase project (or local Supabase via CLI)
- VAPID keys for push notifications

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_CONTACT_EMAIL=
```

### Setup

```bash
npm install
supabase start          # or point to your hosted project
supabase db push        # apply migrations
npm run dev             # http://localhost:3000
```

### Other Commands

```bash
npm run build           # production build
npm run lint            # ESLint
supabase functions serve  # run edge functions locally
node scripts/migrate.mjs  # DB migration helper
```

---

## Architecture Notes

**XP and coins** are awarded exclusively via DB triggers (`award_xp_and_coins` RPC). Never call award logic from client code.

**Realtime** uses a single Supabase channel per couple (`couple:{couple_id}`). Feature-level changes (habit completions, calendar updates) subscribe via Postgres Changes inside their own hooks.

**Themes** are pure CSS custom property swaps — switching `data-theme` on `<html>` cascades to all `.glass`, `.gradient-text`, and `.gradient-accent` usages with zero JS re-renders.

**Navigation performance** — stores track `hydratedForId` so tab switches never re-fetch data already in memory. Realtime keeps the data fresh.

---

## License

Private — all rights reserved.
