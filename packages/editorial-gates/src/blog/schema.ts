export type BlogSectionDraft = {
  heading: string;
  paragraphs: string[];
  points?: string[];
};

export type BlogPostDraft = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  keywords: string[];
  sections: BlogSectionDraft[];
  socialThreadTr?: [string, string];
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateBlogPostDraft(raw: unknown): raw is BlogPostDraft {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  if (typeof o.slug !== "string" || !SLUG_RE.test(o.slug)) return false;
  if (typeof o.title !== "string" || o.title.length < 12) return false;
  if (typeof o.excerpt !== "string" || o.excerpt.length < 40) return false;
  if (typeof o.description !== "string" || o.description.length < 40) return false;
  if (!Array.isArray(o.keywords) || o.keywords.length < 3) return false;
  if (!Array.isArray(o.sections) || o.sections.length < 3) return false;
  for (const section of o.sections) {
    if (!section || typeof section !== "object") return false;
    const s = section as Record<string, unknown>;
    if (typeof s.heading !== "string" || s.heading.length < 4) return false;
    if (!Array.isArray(s.paragraphs) || s.paragraphs.length < 1) return false;
    for (const p of s.paragraphs) {
      if (typeof p !== "string" || p.length < 40) return false;
    }
  }
  return true;
}
