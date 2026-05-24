"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { HabitForm } from "@/features/habits/components/HabitForm";
import { createHabit } from "@/features/habits/actions/habits.actions";
import { useHabitsStore } from "@/stores/habitsStore";
import type { HabitFormValues } from "@/features/habits/components/HabitForm";
import type { Habit } from "@/types/app.types";

export default function NewHabitPage() {
  const router = useRouter();
  const { addHabit } = useHabitsStore();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: HabitFormValues) {
    setIsLoading(true);
    const result = await createHabit(values);
    setIsLoading(false);
    if (result?.data) {
      addHabit(result.data as Habit);
      router.push("/habits");
    }
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      <div className="flex items-center gap-3">
        <Link href="/habits" className="text-slate-400 hover:text-slate-200 transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-slate-100">New Habit</h1>
      </div>
      <HabitForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Create habit" />
    </div>
  );
}
