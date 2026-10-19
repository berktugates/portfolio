/** Keep in sync with app/lib/content/reading-minutes.ts (Latin locales). */

import {
  MIN_READING_MINUTES,
  MAX_READING_MINUTES,
  WORDS_PER_MINUTE,
  readingMinutesFromSections as gateReadingMinutes,
} from "./queue-reading-gate.mjs";

const MIN = MIN_READING_MINUTES;
const MAX = MAX_READING_MINUTES;
const WPM = WORDS_PER_MINUTE;

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
  return sections.map((section) => ({
    ...section,
    paragraphs: normalizeParagraphs(section.paragraphs),
  }));
}

export function readingMinutesFromSections(sections, locale = "en") {
  return gateReadingMinutes(sections, locale);
}
