import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function formatSymptomDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isToday(d)) return `Today at ${format(d, "h:mm a")}`;
  if (isYesterday(d)) return `Yesterday at ${format(d, "h:mm a")}`;
  return format(d, "MMM d, yyyy 'at' h:mm a");
}

export function formatRelative(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy");
}
