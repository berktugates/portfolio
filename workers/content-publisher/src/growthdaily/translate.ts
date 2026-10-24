import type { ReadingLocale } from "@berktug/editorial-gates/blog/reading-html";
import { countReadingUnits, stripHtmlToText } from "@berktug/editorial-gates/blog/reading-html";

const TRANSLATE_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const AI_LOCALES: ReadingLocale[] = ["tr", "de", "fr", "it", "zh", "ja"];

const LOCALE_LABEL: Record<(typeof AI_LOCALES)[number], string> = {
  tr: "Turkish",
  de: "German",
  fr: "French",
  it: "Italian",
  zh: "Simplified Chinese",
  ja: "Japanese",
};

function tagCount(html: string): number {
  return (html.match(/<\/?[a-z][^>]*>/gi) ?? []).length;
}

function englishLeakRatio(text: string): number {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 1;
  const latin = words.filter((w) => /^[a-z0-9'-]+$/i.test(w)).length;
  return latin / words.length;
}

function localeLeakOk(text: string, locale: ReadingLocale): boolean {
  if (locale === "zh" || locale === "ja") {
    const cjk = text.match(/[\u4e00-\u9fff\u3040-\u30ff\u3400-\u4dbf]/g);
    const ratio = (cjk?.length ?? 0) / Math.max(1, text.length);
    return ratio > 0.08;
  }
  return englishLeakRatio(text) < 0.35;
}

async function translateHtmlChunk(env: Env, html: string, locale: ReadingLocale): Promise<string> {
  const label = LOCALE_LABEL[locale as (typeof AI_LOCALES)[number]];
  const result = await env.AI.run(TRANSLATE_MODEL, {
    messages: [
      {
        role: "system",
        content:
          "You translate HTML articles. Preserve every HTML tag and attribute exactly; only translate visible text nodes. Return ONLY the translated HTML fragment, no markdown fences.",
      },
      {
        role: "user",
        content: `Target language: ${label} (${locale}).\n\n${html}`,
      },
    ],
    max_tokens: 8192,
  });
  const text =
    typeof result === "string"
      ? result
      : ((result as { response?: string }).response ?? String(result));
  return text.trim();
}

function splitHtmlSections(html: string): string[] {
  const parts = html.split(/(?=<h2[\s>])/i).filter((p) => p.trim());
  if (parts.length <= 1) return [html];
  return parts;
}

export async function translateHtmlToLocale(
  env: Env,
  html: string,
  locale: ReadingLocale,
): Promise<{ ok: true; html: string } | { ok: false; code: string }> {
  if (!AI_LOCALES.includes(locale as (typeof AI_LOCALES)[number])) {
    return { ok: false, code: "unsupported-locale" };
  }
  const sourceTags = tagCount(html);
  const chunks = splitHtmlSections(html);
  const translated: string[] = [];
  for (const chunk of chunks) {
    translated.push(await translateHtmlChunk(env, chunk, locale));
  }
  const out = translated.join("");
  if (Math.abs(tagCount(out) - sourceTags) > 4) {
    return { ok: false, code: "html-skeleton-mismatch" };
  }
  const plain = stripHtmlToText(out);
  if (!localeLeakOk(plain, locale)) {
    return { ok: false, code: "locale-leak" };
  }
  const srcUnits = countReadingUnits(stripHtmlToText(html), "en");
  const dstUnits = countReadingUnits(plain, locale);
  if (dstUnits < srcUnits * 0.45) {
    return { ok: false, code: "translation-too-short" };
  }
  return { ok: true, html: out };
}

export const WORKER_TRANSLATED_LOCALES = AI_LOCALES;
