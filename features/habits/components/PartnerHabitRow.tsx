"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useCoupleStore } from "@/stores/coupleStore";
import { useHabitsStore } from "@/stores/habitsStore";

interface PartnerHabitRowProps {
  habitId: string;
}

export function PartnerHabitRow({ habitId }: PartnerHabitRowProps) {
  const partner = useCoupleStore((s) => s.partner);
  const partnerCompletions = useHabitsStore((s) => s.partnerCompletions);

  if (!partner) return null;

  const done = partnerCompletions[habitId] ?? false;

  return (
    <div className="flex items-center gap-2 px-1 py-0.5">
      <Avatar src={partner.avatar_url} name={partner.display_name} size="xs" />
      <span className="text-xs text-slate-500 truncate flex-1">{partner.display_name}</span>
      {done ? (
        <CheckCircle2 className="h-4 w-4 text-pink-400 shrink-0" />
      ) : (
        <Circle className="h-4 w-4 text-slate-700 shrink-0" />
      )}
    </div>
  );
}
