/** Brifing gövdesinden okur özeti maddeleri (paragraf başına bir satır). */
export function briefingHighlights(bodyMarkdown: string, max = 4): string[] {
  return bodyMarkdown
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, max);
}
