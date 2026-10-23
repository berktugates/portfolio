import { assessContentSafety } from "../content-safety";
import {
  countReadingUnits,
  estimateReadingMinutesFromHtml,
  MIN_READING_MINUTES,
  CJK_CHARS_PER_MINUTE,
  WORDS_PER_MINUTE,
  stripHtmlToText,
  type ReadingLocale,
} from "./reading-html";

export type GrowthDailyQualityBand = "premium" | "standard" | "review";

export type GrowthDailyGateInput = {
  title: string;
  excerpt: string;
  contentHtml: string;
  qualityBand: GrowthDailyQualityBand | null | undefined;
  keywords: readonly string[];
  locale: ReadingLocale;
  slug: string;
  slugTaken: boolean;
};

export type GrowthDailyGateResult = { ok: true } | { ok: false; code: string; detail?: string };

const SOFTWARE_TOPIC_RE =
  /\b(software|engineering|api|backend|frontend|react|expo|native|devops|sre|reliability|security|architecture|typescript|javascript|cloudflare|kubernetes|docker|database|postgres|redis|graphql|rest|oauth|seo|geo|llm|ai|machine learning|mimari|mühendis|yazılım|güvenlik|performans|observability|telemetry|microservice|ci\/cd|testing|deployment|infrastructure|vercel|next\.?js)\b/i;

const EXTERNAL_LINK_RE = /<a\b[^>]*\bhref=["'](https:\/\/[^"']+)["']/gi;

export function countExternalHttpsLinks(html: string): number {
  const hosts = new Set<string>();
  let match: RegExpExecArray | null;
  EXTERNAL_LINK_RE.lastIndex = 0;
  while ((match = EXTERNAL_LINK_RE.exec(html)) !== null) {
    try {
      const url = new URL(match[1]!);
      if (url.protocol !== "https:") continue;
      if (/berktugberke\.com$/i.test(url.hostname)) continue;
      hosts.add(url.hostname.toLowerCase());
    } catch {
      /* skip malformed */
    }
  }
  return hosts.size;
}

export function isSoftwareTopic(title: string, excerpt: string, keywords: readonly string[]): boolean {
  const blob = [title, excerpt, ...keywords].join("\n");
  return SOFTWARE_TOPIC_RE.test(blob);
}

export function runGrowthDailyGates(input: GrowthDailyGateInput): GrowthDailyGateResult {
  if (input.slugTaken) {
    return { ok: false, code: "slug-collision", detail: input.slug };
  }

  const band = input.qualityBand ?? "review";
  if (band === "review") {
    return { ok: false, code: "quality-band-review", detail: band };
  }

  const plain = stripHtmlToText(input.contentHtml);
  const units = countReadingUnits(plain, input.locale);
  const pace = input.locale === "zh" || input.locale === "ja" ? CJK_CHARS_PER_MINUTE : WORDS_PER_MINUTE;
  if (units < MIN_READING_MINUTES * pace) {
    return {
      ok: false,
      code: "reading-too-short",
      detail: String(estimateReadingMinutesFromHtml(input.contentHtml, input.locale)),
    };
  }

  if (!isSoftwareTopic(input.title, input.excerpt ?? "", input.keywords)) {
    return { ok: false, code: "off-topic", detail: input.title };
  }

  const externalLinks = countExternalHttpsLinks(input.contentHtml);
  const gdsSourceTraceabilityOk = band === "premium" || band === "standard";
  if (!gdsSourceTraceabilityOk && externalLinks < 3) {
    return { ok: false, code: "insufficient-sources", detail: String(externalLinks) };
  }

  const bodyText = input.contentHtml.replace(/<[^>]+>/g, " ");
  const safety = assessContentSafety({
    title: input.title,
    body: bodyText,
    excerpt: input.excerpt,
    channel: "blog",
    mode: "publish",
    editorialSource: "growthdaily",
  });
  if (!safety.ok) {
    return { ok: false, code: safety.code, detail: safety.hits.join(",") };
  }

  return { ok: true };
}
