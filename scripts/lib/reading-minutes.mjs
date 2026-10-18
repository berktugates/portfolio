/** Keep in sync with app/lib/content/reading-minutes.ts (Latin locales). */

const MIN = 4;
const MAX = 15;
const WPM = 80;

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

export function readingMinutesFromSections(sections) {
  const text = sections
    .flatMap((section) => [
      section.heading ?? "",
      ...normalizeParagraphs(section.paragraphs),
      ...(section.points ?? []),
    ])
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  if (!words) return MIN;
  return Math.max(MIN, Math.min(MAX, Math.round(words / WPM)));
}
