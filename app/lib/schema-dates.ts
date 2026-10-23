const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * schema.org / Search Console friendly ISO-8601 datetime (UTC, with milliseconds).
 * Bare `YYYY-MM-DD` becomes noon UTC so timezone conversions never shift the calendar day.
 */
export function toSchemaDateTime(value: string | null | undefined, fallback?: string): string {
  const raw = value?.trim();
  if (raw) {
    if (DATE_ONLY.test(raw)) {
      const d = new Date(`${raw}T12:00:00.000Z`);
      if (!Number.isNaN(d.getTime())) return d.toISOString();
    } else {
      const d = new Date(raw);
      if (!Number.isNaN(d.getTime())) return d.toISOString();
    }
  }
  if (fallback !== undefined) return toSchemaDateTime(fallback);
  return new Date().toISOString();
}
