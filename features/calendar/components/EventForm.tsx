"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const EMOJIS = ["🎉", "🎂", "✈️", "🏖️", "🍽️", "🎬", "🏥", "📅", "🏃", "🎓", "💍", "🏡", "🌟", "❤️", "🎁", "🎊"];
const COLORS = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#f97316", "#64748b"];
const REMINDER_OPTIONS = [
  { label: "None", value: null },
  { label: "15 min before", value: 15 },
  { label: "30 min before", value: 30 },
  { label: "1 hour before", value: 60 },
  { label: "1 day before", value: 1440 },
  { label: "1 week before", value: 10080 },
];

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  emoji: z.string().optional(),
  starts_at: z.string().min(1, "Date is required"),
  ends_at: z.string().optional(),
  all_day: z.boolean(),
  color: z.string(),
  location: z.string().optional(),
  reminderMins: z.number().nullable().optional(),
});

export type EventFormValues = z.infer<typeof schema>;

interface EventFormProps {
  defaultValues?: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function EventForm({ defaultValues, onSubmit, isLoading, submitLabel = "Save event" }: EventFormProps) {
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<EventFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      all_day: false,
      color: "#10b981",
      emoji: "📅",
      reminderMins: 60,
      ...defaultValues,
    },
  });

  const selectedEmoji = watch("emoji");
  const selectedColor = watch("color");
  const allDay = watch("all_day");
  const reminderMins = watch("reminderMins");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="Event title"
        placeholder="e.g. Dinner date"
        error={errors.title?.message}
        autoFocus
        {...register("title")}
      />

      {/* Emoji */}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Emoji</p>
        <div className="grid grid-cols-8 gap-1.5">
          {EMOJIS.map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => setValue("emoji", em)}
              className={`h-9 w-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                selectedEmoji === em ? "bg-white/20 ring-2 ring-white/40 scale-110" : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {em}
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
              className={`h-7 w-7 rounded-full transition-all ${
                selectedColor === color ? "ring-2 ring-white/80 ring-offset-2 ring-offset-[#050a14] scale-110" : ""
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* All day toggle */}
      <div className="glass rounded-xl px-4 py-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-200">All day</p>
        <button
          type="button"
          onClick={() => setValue("all_day", !allDay)}
          className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${allDay ? "bg-emerald-500" : "bg-white/15"}`}
        >
          <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${allDay ? "translate-x-5" : ""}`} />
        </button>
      </div>

      {/* Date / time */}
      <Input
        label={allDay ? "Date" : "Starts"}
        type={allDay ? "date" : "datetime-local"}
        error={errors.starts_at?.message}
        {...register("starts_at")}
      />

      {!allDay && (
        <Input
          label="Ends (optional)"
          type="datetime-local"
          {...register("ends_at")}
        />
      )}

      <Input
        label="Location (optional)"
        placeholder="Where is it?"
        {...register("location")}
      />

      <Input
        label="Description (optional)"
        placeholder="Any notes?"
        {...register("description")}
      />

      {/* Reminder */}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Reminder</p>
        <div className="grid grid-cols-2 gap-2">
          {REMINDER_OPTIONS.map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => setValue("reminderMins", opt.value)}
              className={`rounded-xl px-3 py-2 text-left text-xs transition-all ${
                reminderMins === opt.value
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                  : "glass text-slate-400 hover:text-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" loading={isLoading} className="mt-1">
        {submitLabel}
      </Button>
    </form>
  );
}
