"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const ICONS = ["🏃", "📚", "💧", "🧘", "🍎", "💪", "✍️", "🎯", "🌿", "🧹", "💤", "🎨", "🎵", "🏋️", "🚴", "🍵"];
const COLORS = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#f97316", "#84cc16"];

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  icon: z.string(),
  color: z.string(),
  frequency: z.enum(["daily", "weekdays", "custom"]),
  is_shared: z.boolean(),
  xp_reward: z.number(),
  coin_reward: z.number(),
});

export type HabitFormValues = z.infer<typeof schema>;

interface HabitFormProps {
  defaultValues?: Partial<HabitFormValues>;
  onSubmit: (values: HabitFormValues) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function HabitForm({ defaultValues, onSubmit, isLoading, submitLabel = "Save habit" }: HabitFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<HabitFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      icon: "🎯",
      color: "#10b981",
      frequency: "daily",
      is_shared: false,
      xp_reward: 15,
      coin_reward: 3,
      ...defaultValues,
    },
  });

  const selectedIcon = watch("icon");
  const selectedColor = watch("color");
  const frequency = watch("frequency");
  const isShared = watch("is_shared");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="Habit name"
        placeholder="e.g. Morning run"
        error={errors.title?.message}
        autoFocus
        {...register("title")}
      />

      <Input
        label="Description (optional)"
        placeholder="What's this habit about?"
        {...register("description")}
      />

      {/* Icon */}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Icon</p>
        <div className="grid grid-cols-8 gap-2">
          {ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setValue("icon", icon)}
              className={`h-9 w-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                selectedIcon === icon
                  ? "bg-white/20 ring-2 ring-white/40 scale-110"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Color</p>
        <div className="flex gap-2.5 flex-wrap">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue("color", color)}
              className={`h-8 w-8 rounded-full transition-all ${
                selectedColor === color
                  ? "ring-2 ring-white/80 ring-offset-2 ring-offset-[#050a14] scale-110"
                  : ""
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Frequency</p>
        <div className="flex flex-col gap-2">
          {(["daily", "weekdays", "custom"] as const).map((freq) => (
            <button
              key={freq}
              type="button"
              onClick={() => setValue("frequency", freq)}
              className={`rounded-xl px-4 py-2.5 text-left text-sm transition-all ${
                frequency === freq
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                  : "bg-white/5 border border-white/8 text-slate-400 hover:bg-white/8"
              }`}
            >
              {freq === "daily" ? "Every day" : freq === "weekdays" ? "Weekdays only" : "Custom days"}
            </button>
          ))}
        </div>
      </div>

      {/* Shared toggle */}
      <div className="glass rounded-xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-200">Share with partner</p>
          <p className="text-xs text-slate-500 mt-0.5">They can see and track your progress</p>
        </div>
        <button
          type="button"
          onClick={() => setValue("is_shared", !isShared)}
          className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
            isShared ? "bg-emerald-500" : "bg-white/15"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
              isShared ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <Button type="submit" loading={isLoading} className="mt-1">
        {submitLabel}
      </Button>
    </form>
  );
}
