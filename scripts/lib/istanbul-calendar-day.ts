const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Istanbul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** `YYYY-MM-DD` in Europe/Istanbul (matches Worker daily cap). */
export function istanbulCalendarDay(at: Date = new Date()): string {
  return dayFormatter.format(at);
}
