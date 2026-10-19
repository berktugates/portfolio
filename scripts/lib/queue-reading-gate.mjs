/** Keep in sync with app/lib/content/reading-minutes.ts */

export const MIN_READING_MINUTES = 10;
export const MAX_READING_MINUTES = 25;
export const MIN_EN_WORDS = 800;
export const WORDS_PER_MINUTE = 80;
export const CJK_UNITS_PER_MINUTE = 350;

const CJK = new Set(["zh", "ja"]);

export function normalizeParagraphs(paragraphs) {
  const out = [];
  for (const item of paragraphs ?? []) {
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

export function normalizeSections(sections) {
  return (sections ?? []).map((section) => ({
    ...section,
    paragraphs: normalizeParagraphs(section.paragraphs),
  }));
}

export function readingTextFromSections(sections) {
  return normalizeSections(sections)
    .flatMap((section) => [
      section.heading ?? "",
      ...section.paragraphs,
      ...(section.points ?? []),
    ])
    .join("\n");
}

export function countReadingUnits(text, locale) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  if (CJK.has(locale)) {
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

export function readingMinutesFromSections(sections, locale = "en") {
  const units = countReadingUnits(readingTextFromSections(sections), locale);
  if (!units) return MIN_READING_MINUTES;
  const pace = CJK.has(locale) ? CJK_UNITS_PER_MINUTE : WORDS_PER_MINUTE;
  return Math.max(
    MIN_READING_MINUTES,
    Math.min(MAX_READING_MINUTES, Math.round(units / pace)),
  );
}

export function assertQueueReadingPost(raw, label = "queue post") {
  const enSections = normalizeSections(raw.sections);
  const enText = readingTextFromSections(enSections);
  const enWords = enText.split(/\s+/).filter(Boolean).length;
  if (enWords < MIN_EN_WORDS) {
    throw new Error(
      `${label} ${raw.slug}: EN body too short (${enWords} words, need ≥${MIN_EN_WORDS}). Run pnpm blog-queue:sync.`,
    );
  }
  const enMinutes = readingMinutesFromSections(enSections, "en");
  if (enMinutes < MIN_READING_MINUTES) {
    throw new Error(
      `${label} ${raw.slug}: EN reading time ${enMinutes} min (need ≥${MIN_READING_MINUTES}). Run pnpm blog-queue:sync.`,
    );
  }
  for (const locale of ["tr", "de", "fr", "it", "zh", "ja"]) {
    const copy = raw.locales?.[locale];
    if (!copy?.sections) {
      throw new Error(`${label} ${raw.slug}: missing locales.${locale}.sections`);
    }
    const minutes = readingMinutesFromSections(copy.sections, locale);
    if (minutes < MIN_READING_MINUTES) {
      throw new Error(
        `${label} ${raw.slug}: locales.${locale} reading time ${minutes} min (need ≥${MIN_READING_MINUTES}). Run pnpm blog-queue:sync.`,
      );
    }
  }
}
