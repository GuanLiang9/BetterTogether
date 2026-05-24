# Couple Feature

## Responsibility
Manages partner linking via invite code, partner profile display, online presence, and the emoji reaction/nudge system. This is the social glue of the entire app.

## Key Files
- `components/InviteCodeCard.tsx` — displays user's 8-char code with copy button, or input to enter partner's code
- `components/PartnerCard.tsx` — shows partner avatar, level, current streak, online indicator
- `components/ReactionPanel.tsx` — emoji grid that sends broadcast reactions
- `components/NudgeButton.tsx` — sends a persisted nudge push notification
- `hooks/useCouple.ts` — reads coupleStore, exposes sendReaction/sendNudge
- `actions/couple.actions.ts` — generateInviteCode, acceptInvite, dissolveCouple, sendNudge

## Rules
- Invite codes are 8 chars, uppercase alphanumeric, generated server-side.
- `acceptInvite`: validates code → checks couple_links → sets user_b_id → updates both profiles.couple_id.
- Reactions are BROADCAST only (not persisted). EmojiReaction component listens to coupleStore.pendingReactions.
- Nudges ARE persisted to notifications and trigger push if partner has push enabled.
- A user can only be in ONE active couple. Enforce this at DB level AND in Server Action.
- Never expose the partner's push_subscription JSON to the client.

## Realtime
- RealtimeProvider routes 'couple.reaction' broadcast → coupleStore.addReaction()
- RealtimeProvider routes 'couple.nudge' broadcast → show a Toast
- Partner online status uses Supabase Presence on the couple:{couple_id} channel
