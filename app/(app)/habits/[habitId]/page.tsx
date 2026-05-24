import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, Flame, Zap, Pencil } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HabitHistory } from "@/features/habits/components/HabitHistory";
import { archiveHabit } from "@/features/habits/actions/habits.actions";

export default async function HabitDetailPage({ params }: { params: Promise<{ habitId: string }> }) {
  const { habitId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: habit } = await supabase
    .from("habits").select("*").eq("id", habitId).single();
  if (!habit || habit.owner_id !== user.id) notFound();

  const [{ data: streak }, { data: completions }] = await Promise.all([
    supabase.from("habit_streaks").select("*")
      .eq("habit_id", habitId).eq("user_id", user.id).single(),
    supabase.from("habit_completions").select("completed_date")
      .eq("habit_id", habitId).eq("user_id", user.id)
      .gte("completed_date", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        .toISOString().split("T")[0]),
  ]);

  const completedDates = (completions ?? []).map((c) => c.completed_date);

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/habits" className="text-slate-400 hover:text-slate-200 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${habit.color}22` }}
          >
            {habit.icon ?? "✅"}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 leading-tight">{habit.title}</h1>
            {habit.description && (
              <p className="text-xs text-slate-500">{habit.description}</p>
            )}
          </div>
        </div>
        <Link href={`/habits/${habitId}/edit`}>
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
            <Flame className="h-4 w-4" />
            <span className="text-xl font-bold">{streak?.current_streak ?? 0}</span>
          </div>
          <p className="text-xs text-slate-500">Current streak</p>
        </Card>
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="h-4 w-4 text-slate-500" />
            <span className="text-xl font-bold text-slate-300">{streak?.longest_streak ?? 0}</span>
          </div>
          <p className="text-xs text-slate-500">Best streak</p>
        </Card>
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
            <Zap className="h-4 w-4" />
            <span className="text-xl font-bold">+{habit.xp_reward}</span>
          </div>
          <p className="text-xs text-slate-500">XP / day</p>
        </Card>
      </div>

      {/* History heatmap */}
      <HabitHistory completedDates={completedDates} color={habit.color} />

      {/* Danger zone */}
      <form
        action={async () => {
          "use server";
          await archiveHabit(habitId);
          redirect("/habits");
        }}
      >
        <button
          type="submit"
          className="text-xs text-red-500/50 hover:text-red-500 transition-colors"
        >
          Archive this habit
        </button>
      </form>
    </div>
  );
}
