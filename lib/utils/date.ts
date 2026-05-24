import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { format, differenceInCalendarDays, parseISO } from "date-fns";

export function getTodayInTimezone(timezone: string): string {
  return formatInTimeZone(new Date(), timezone, "yyyy-MM-dd");
}

export function formatEventDate(date: string | Date, timezone: string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatInTimeZone(d, timezone, "MMM d, yyyy · h:mm a");
}

export function daysUntil(targetDate: string | Date, timezone: string): number {
  const today = toZonedTime(new Date(), timezone);
  const target = typeof targetDate === "string" ? parseISO(targetDate) : targetDate;
  return differenceInCalendarDays(target, today);
}

export function formatShortDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d");
}

export function formatISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
