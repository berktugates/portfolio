import type { BlogSection } from "../../data/blogs";
import type { Locale } from "../i18n/config";

const MIN_MINUTES = 4;
const MAX_MINUTES = 15;
/** Technical long-form pace; aligns with legacy `readingMinutes` on deeper articles. */
const WORDS_PER_MINUTE = 80;
/** CJK readers count characters more than space-delimited tokens. */
const CJK_CHARS_PER_MINUTE = 350;

function isCjkLocale(locale: Locale): boolean {
  return locale === "zh" || locale === "ja";
}

/** Flatten legacy queue JSON where each section wrapped paragraphs in an extra array. */
export function normalizeParagraphs(paragraphs: readonly unknown[]): string[] {
  const out: string[] = [];
  for (const item of paragraphs) {
    if (typeof item === "string") {
      if (item.trim()) out.push(item);
      continue;
    }
    if (Array.isArray(item)) {
      for (const nested of item) {
        if (typeof nested === "string" && nested.trim()) out.push(nested);
      }
    }
  }
  return out;
}

export function normalizeBlogSections(
  sections: readonly BlogSection[],
): readonly BlogSection[] {
  return sections.map((section) => ({
    ...section,
    paragraphs: normalizeParagraphs(section.paragraphs as unknown[]),
    ...(section.points ? { points: [...section.points] } : {}),
    ...(section.links ? { links: section.links.map((link) => ({ ...link })) } : {}),
  }));
}

export function readingTextFromSections(sections: readonly BlogSection[]): string {
  return sections
    .flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.points ?? []),
    ])
    .join("\n");
}

export function countReadingUnits(text: string, locale: Locale): number {
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

export function estimateReadingMinutesFromSections(
  sections: readonly BlogSection[],
  locale: Locale,
): number {
  const units = countReadingUnits(readingTextFromSections(sections), locale);
  if (units === 0) return MIN_MINUTES;
  const pace = isCjkLocale(locale) ? CJK_CHARS_PER_MINUTE : WORDS_PER_MINUTE;
  return Math.max(MIN_MINUTES, Math.min(MAX_MINUTES, Math.round(units / pace)));
}
