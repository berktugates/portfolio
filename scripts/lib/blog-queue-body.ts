/** Blog kuyruk JSON → düz metin (content-safety; JSON.stringify tırnak tuzaklarından kaçınır). */

type Section = {
  heading?: string;
  paragraphs?: string[];
  points?: string[];
};

function sectionsToText(sections: Section[]): string {
  return sections
    .map((sec) => [sec.heading ?? "", ...(sec.paragraphs ?? []), ...(sec.points ?? [])].join("\n"))
    .join("\n\n");
}

export function extractBlogQueuePlainText(raw: Record<string, unknown>): string {
  if (typeof raw.draftBody === "string") return raw.draftBody;
  if (typeof raw.bodyMarkdown === "string") return raw.bodyMarkdown;

  const parts: string[] = [];
  if (Array.isArray(raw.sections)) {
    parts.push(sectionsToText(raw.sections as Section[]));
  }
  const locales = raw.locales as Record<string, { sections?: Section[] }> | undefined;
  if (locales && typeof locales === "object") {
    for (const loc of Object.values(locales)) {
      if (loc?.sections) parts.push(sectionsToText(loc.sections));
    }
  }
  const body = parts.filter(Boolean).join("\n\n");
  return body || JSON.stringify(raw.sections ?? raw);
}
