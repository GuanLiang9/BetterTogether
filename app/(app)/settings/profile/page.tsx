"use client";

import { useState, useEffect } from "react";
import { User, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/stores/authStore";
import { updateProfile } from "@/features/gamification/actions/gamification.actions";

const TIMEZONES = [
  "Asia/Singapore",
  "Asia/Kuala_Lumpur",
  "Asia/Jakarta",
  "Asia/Bangkok",
  "Asia/Manila",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Australia/Sydney",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "UTC",
];

export default function ProfilePage() {
  const profile = useAuthStore((s) => s.profile);
  const updateStore = useAuthStore((s) => s.updateProfile);

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [timezone, setTimezone] = useState(profile?.timezone ?? "Asia/Singapore");
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name);
    setTimezone(profile.timezone);
  }, [profile?.id]); // intentional: only reset form when profile identity changes, not on every update

  async function handleSave() {
    if (!displayName.trim()) return;
    setIsLoading(true);
    setSaved(false);
    setError(null);
    const result = await updateProfile({ display_name: displayName.trim(), timezone });
    if (result.error) {
      setError(result.error);
    } else {
      updateStore({ display_name: displayName.trim(), timezone });
      setSaved(true);
    }
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-cyan-400" />
        <h1 className="text-2xl font-bold text-slate-100">Profile</h1>
      </div>

      <Card className="p-5 flex flex-col gap-5">
        {/* Avatar + stats */}
        <div className="flex items-center gap-4">
          <Avatar src={profile?.avatar_url} name={profile?.display_name} size="lg" />
          <div>
            <p className="text-sm font-semibold text-slate-200">{profile?.display_name}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">
              Level {profile?.level ?? 1} · {(profile?.xp ?? 0).toLocaleString("en-SG")} XP
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              🪙 {(profile?.coins ?? 0).toLocaleString("en-SG")} coins
            </p>
          </div>
        </div>

        {/* Display name */}
        <Input
          label="Display name"
          value={displayName}
          onChange={(e) => { setDisplayName(e.target.value); setSaved(false); }}
          placeholder="Your name"
          maxLength={50}
        />

        {/* Timezone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => { setTimezone(e.target.value); setSaved(false); }}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz} className="bg-slate-900 text-slate-200">
                {tz}
              </option>
            ))}
          </select>
        </div>

        {/* Feedback */}
        {error && <p className="text-xs text-red-400">{error}</p>}
        {saved && (
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            Profile saved
          </div>
        )}

        <Button onClick={handleSave} loading={isLoading} disabled={!displayName.trim()} className="w-full gap-2">
          {!isLoading && <Check className="h-4 w-4" />}
          Save changes
        </Button>
      </Card>
    </div>
  );
}
