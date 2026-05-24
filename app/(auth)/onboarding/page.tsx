"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { useAuthStore } from "@/stores/authStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { InviteCodeCard } from "@/features/couple/components/InviteCodeCard";
import { ChevronRight, ChevronLeft } from "lucide-react";

const TIMEZONES = [
  { label: "Singapore (SGT)", value: "Asia/Singapore" },
  { label: "Malaysia (MYT)", value: "Asia/Kuala_Lumpur" },
  { label: "Japan (JST)", value: "Asia/Tokyo" },
  { label: "UK (GMT)", value: "Europe/London" },
  { label: "US Eastern (EST)", value: "America/New_York" },
  { label: "US Pacific (PST)", value: "America/Los_Angeles" },
  { label: "UTC", value: "UTC" },
];

const STEPS = ["Name", "Timezone", "Partner", "Done"];

export default function OnboardingPage() {
  const supabase = useSupabase();
  const { profile, updateProfile } = useAuthStore();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [timezone, setTimezone] = useState(profile?.timezone ?? "Asia/Singapore");
  const [isPending, startTransition] = useTransition();

  async function saveAndNext() {
    startTransition(async () => {
      if (step === 0) {
        await supabase.from("profiles").update({ display_name: displayName }).eq("id", profile!.id);
        updateProfile({ display_name: displayName });
      }
      if (step === 1) {
        await supabase.from("profiles").update({ timezone }).eq("id", profile!.id);
        updateProfile({ timezone });
      }
      if (step === 3) {
        await supabase.from("profiles").update({ onboarding_complete: true }).eq("id", profile!.id);
        updateProfile({ onboarding_complete: true });
        router.push("/dashboard");
        return;
      }
      setStep((s) => s + 1);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress dots */}
      <div className="flex justify-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? "w-8 bg-emerald-400" : i < step ? "w-4 bg-emerald-600" : "w-4 bg-white/10"
            }`}
          />
        ))}
      </div>

      <Card className="p-6">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">What should we call you?</h2>
              <p className="text-sm text-slate-500 mt-1">Your partner will see this name.</p>
            </div>
            <Input
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              autoFocus
            />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">Your timezone</h2>
              <p className="text-sm text-slate-500 mt-1">Used for habit streaks and reminders.</p>
            </div>
            <div className="flex flex-col gap-2">
              {TIMEZONES.map((tz) => (
                <button
                  key={tz.value}
                  onClick={() => setTimezone(tz.value)}
                  className={`rounded-xl px-4 py-3 text-left text-sm transition-all ${
                    timezone === tz.value
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                      : "bg-white/5 border border-white/8 text-slate-400 hover:bg-white/8"
                  }`}
                >
                  {tz.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">Link with your partner</h2>
              <p className="text-sm text-slate-500 mt-1">Share your code or enter theirs.</p>
            </div>
            <InviteCodeCard />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div className="text-5xl animate-float">🌿</div>
            <h2 className="text-2xl font-bold gradient-text">You&apos;re all set!</h2>
            <p className="text-sm text-slate-500">
              Start building your habits and growing together.
            </p>
          </div>
        )}
      </Card>

      <div className="flex gap-3">
        {step > 0 && step < 3 && (
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)} className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
        )}
        <Button
          onClick={saveAndNext}
          loading={isPending}
          disabled={step === 0 && !displayName.trim()}
          className="flex-1 gap-1"
        >
          {step === 3 ? "Start growing 🌱" : step === 2 ? "Skip for now" : "Continue"}
          {step < 2 && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
