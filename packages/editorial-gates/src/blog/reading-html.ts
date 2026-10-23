/** Aligns with app/lib/content/reading-minutes.ts */

export const MIN_READING_MINUTES = 10;
export const MAX_READING_MINUTES = 25;
export const WORDS_PER_MINUTE = 80;
export const CJK_CHARS_PER_MINUTE = 350;

export type ReadingLocale = "en" | "tr" | "de" | "fr" | "it" | "zh" | "ja";

function isCjkLocale(locale: ReadingLocale): boolean {
  return locale === "zh" || locale === "ja";
}

export function stripHtmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

export function countReadingUnits(text: string, locale: ReadingLocale): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  if (isCjkLocale(locale)) {
    const cjk = trimmed.match(/[\u4e00-\u9fff\u3040-\u30ff\u3400-\u4dbf]/g);
    const cjkCount = cjk?.length ?? 0;
    const otherWords = trimmed
      .replace(/[\u4e00-\u9fff\u3040-\u30ff\u3400-\u4dbf]/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
    return cjkCount + otherWords;
  }
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function estimateReadingMinutesFromHtml(html: string, locale: ReadingLocale): number {
  const units = countReadingUnits(stripHtmlToText(html), locale);
  if (units === 0) return MIN_READING_MINUTES;
  const pace = isCjkLocale(locale) ? CJK_CHARS_PER_MINUTE : WORDS_PER_MINUTE;
  return Math.max(MIN_READING_MINUTES, Math.min(MAX_READING_MINUTES, Math.round(units / pace)));
}
