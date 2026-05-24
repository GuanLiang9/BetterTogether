# Gamification Feature

## Responsibility
XP/coin display, level-up modal, unlockables shop, and visual feedback layer (floating XP toasts, level-up celebrations).

## Key Files
- `components/LevelUpModal.tsx` — fullscreen celebration overlay; shows new level title and new unlocks
- `components/XpToast.tsx` — floating "+15 XP" toast; Framer Motion animate-xp-toast
- `components/ShopGrid.tsx` — grid of UnlockableCard, filterable by category
- `components/UnlockableCard.tsx` — preview, cost, lock/unlock state, equip button
- `components/CoinDisplay.tsx` — coin balance with animated increment
- `hooks/useGamification.ts` — reads gamificationStore, exposes purchaseUnlockable/equipUnlockable
- `actions/gamification.actions.ts` — purchaseUnlockable, equipUnlockable

## Rules
- XP and coins are NEVER awarded from client code or this feature's Server Actions.
  All awards happen via DB triggers (habit/focus/calendar actions trigger them).
- gamificationStore.xp/coins/level sync via Postgres Changes on the user's own profiles row.
- LevelUpModal fires when gamificationStore.pendingLevelUp is true (set by Postgres Change showing level increase).
- XpToast fires when gamificationStore.pendingXpGain is non-null; clears after animation.
- purchaseUnlockable Server Action: validate coin balance → INSERT user_unlockables → INSERT coin_ledger (negative) → UPDATE profiles.coins atomically in a transaction.
- Theme unlockables: equipping updates profiles.active_theme → CSS class on <html>.

## Patterns
- XP bar: CSS transition on width (xp / xpToNextLevel * 100%).
- LevelUpModal uses Framer Motion scale + fade reveal.
- Shop shows lock icon with unlock condition tooltip for items not yet earned.
