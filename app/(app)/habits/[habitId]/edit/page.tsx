"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { useAuthStore } from "@/stores/authStore";
import { useHabitsStore } from "@/stores/habitsStore";
import { updateHabit } from "@/features/habits/actions/habits.actions";
import { HabitForm } from "@/features/habits/components/HabitForm";
import type { HabitFormValues } from "@/features/habits/components/HabitForm";
import type { Habit } from "@/types/app.types";

export default function EditHabitPage({ params }: { params: Promise<{ habitId: string }> }) {
  const { habitId } = use(params);
  const router = useRouter();
  const supabase = useSupabase();
  const profile = useAuthStore((s) => s.profile);
  const { updateHabit: updateStore } = useHabitsStore();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;
    supabase.from("habits").select("*")
      .eq("id", habitId).eq("owner_id", profile.id)
      .single()
      .then(({ data }) => { if (data) setHabit(data); });
  }, [habitId, profile?.id, supabase]);

  async function handleSubmit(values: HabitFormValues) {
    setIsSubmitting(true);
    const result = await updateHabit(habitId, values);
    setIsSubmitting(false);
    if (result?.data) {
      updateStore(habitId, result.data as Partial<Habit>);
      router.push(`/habits/${habitId}`);
    }
  }

  if (!habit) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      <div className="flex items-center gap-3">
        <Link href={`/habits/${habitId}`} className="text-slate-400 hover:text-slate-200 transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-slate-100">Edit Habit</h1>
      </div>
      <HabitForm
        defaultValues={{
          title: habit.title,
          description: habit.description ?? undefined,
          icon: habit.icon ?? "🎯",
          color: habit.color,
          frequency: habit.frequency,
          is_shared: habit.is_shared,
          xp_reward: habit.xp_reward,
          coin_reward: habit.coin_reward,
        }}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitLabel="Save changes"
      />
    </div>
  );
}
