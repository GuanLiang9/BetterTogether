# Auth Feature

## Responsibility
Handles user authentication (email/password + Google OAuth), session management, and the onboarding wizard. Scope ends when the user lands on /dashboard with a complete profile.

## Key Files
- `components/AuthForm.tsx` — login/signup form, controlled by `mode` prop
- `components/OnboardingWizard.tsx` — multi-step wizard (avatar, display name, timezone, invite code)
- `hooks/useAuth.ts` — wraps supabase.auth, exposes signIn/signUp/signOut/resetPassword
- `actions/auth.actions.ts` — Server Actions for form submissions

## Rules
- NEVER store raw tokens in localStorage. Supabase handles session via cookies.
- Onboarding sets `profiles.onboarding_complete = true` and redirects to /dashboard.
- The invite code step calls `couple.actions.ts acceptInvite` — don't duplicate that logic here.
- Use `createServerClient` from `lib/supabase/server.ts` inside Server Actions, never the browser client.
- On signup, a DB trigger auto-creates the profiles row. Do NOT manually INSERT into profiles.
- Always redirect to /onboarding if `profile.onboarding_complete === false`.

## Patterns
- Forms use react-hook-form + zod for validation.
- Google OAuth only for MVP.
- `AuthForm` is shared between login/signup pages via a `mode` prop.
