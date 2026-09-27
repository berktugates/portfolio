import type { EvidenceClaim, GundemBriefing, NewsRiskLevel } from "./types";
import type { TrMediaFeedItem } from "./feed-ingest";

const HARD_REVIEW_RE =
  /(cinayet|öldürüldü|hayatını kaybetti|yaralı|intihar|cinsel saldırı|tecavüz|çocuk|reşit olmayan|gözaltı|tutuklandı|şüpheli|sanık|suçlama|terör|seçim güvenliği|oy pusulası|sağlık tavsiyesi|tedavi|ilaç|aşı|sızıntı|özel hayat|ifşa)/iu;
const PROHIBITED_NOISE_RE = /(burç|fal|loto|sayısal loto|şans topu|bahis kuponu|ifşa|sızdırılan özel)/iu;
const MARKET_SENSITIVE_RE = /(hisse|borsa|kripto|bitcoin|dolar|euro|faiz|enflasyon|devalüasyon|şirket satın alma)/iu;
const OFFICIAL_SIGNAL_RE = /\b(resmî gazete|resmi gazete|bakanlık|kurumu|başkanlığı|federasyonu|kulübü|tcmb|tüik|afad|mgm|tff|tbmm|kap)\b/iu;
const DEFINITE_RE = /\b(kesinleşti|resmen|onaylandı|karar verildi|yürürlüğe girdi)\b/iu;
const CLICKBAIT_RE = /\?|şoke etti|inanamayacaksınız|olay oldu|bomba gelişme|işte detaylar/iu;
const TUTORIAL_LEDE_RE = /^(nedir|nasıl|ne demek|bir .* olarak tanımlanır|bu yazıda)/iu;
const FILLER_RE = /detaylar(?:ı)? (?:haberimizde|aşağıda)|okumaya devam edin|bugün öne çıkan gelişmeler:?$/iu;

function normalize(text: string): string {
  return text.toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}%₺$€\s.,]/gu, " ").replace(/\s+/g, " ").trim();
}

function tokens(text: string): string[] {
  return normalize(text).split(" ").filter(Boolean);
}

function ngrams(text: string, size: number): Set<string> {
  const list = tokens(text);
  const out = new Set<string>();
  for (let i = 0; i <= list.length - size; i++) out.add(list.slice(i, i + size).join(" "));
  return out;
}

function overlapRatio(body: string, reference: string, size = 8): number {
  const a = ngrams(body, size);
  const b = ngrams(reference, size);
  if (a.size === 0 || b.size === 0) return 0;
  let hits = 0;
  for (const gram of a) if (b.has(gram)) hits++;
  return hits / Math.min(a.size, b.size);
}

export function classifyNewsRisk(text: string, hasExactOfficialSource: boolean): NewsRiskLevel {
  if (PROHIBITED_NOISE_RE.test(text)) return "prohibited";
  if (HARD_REVIEW_RE.test(text)) return "high";
  if (MARKET_SENSITIVE_RE.test(text) && !hasExactOfficialSource) return "high";
  if (MARKET_SENSITIVE_RE.test(text) || /\b(siyaset|bakan|parti|meclis|transfer)\b/iu.test(text)) return "medium";
  return "low";
}

function valuesIn(text: string): string[] {
  return [...text.matchAll(/(?:%\s*)?\d+(?:[.,]\d+)?(?:\s*(?:TL|₺|dolar|euro|puan|oy|kişi|saat|dakika))?/giu)]
    .map((match) => normalize(match[0]));
}

function capitalizedEntities(text: string): string[] {
  return [...text.matchAll(/\b[A-ZÇĞİÖŞÜ][\p{L}ÇĞİÖŞÜçğıöşü]+(?:\s+[A-ZÇĞİÖŞÜ][\p{L}ÇĞİÖŞÜçğıöşü]+){0,3}\b/gu)]
    .map((match) => match[0]);
}

export function claimsFromFeedItems(items: readonly TrMediaFeedItem[]): EvidenceClaim[] {
  const groups = new Map<string, { value: string; itemIds: string[]; official: boolean }>();
  for (const item of items) {
    const facts = [...valuesIn(item.title), ...capitalizedEntities(item.title)];
    for (const fact of facts) {
      const key = normalize(fact);
      if (key.length < 2) continue;
      const current = groups.get(key) ?? { value: fact, itemIds: [], official: false };
      if (!current.itemIds.includes(item.dedupKey)) current.itemIds.push(item.dedupKey);
      current.official ||= item.sourceType === "official";
      groups.set(key, current);
    }
  }
  return [...groups.entries()].map(([key, value], index) => ({
    claimId: `claim-${index + 1}-${key.slice(0, 24).replace(/\s+/g, "-")}`,
    subject: value.value,
    predicate: "headline-fact",
    valueText: value.value,
    officialStatus: value.official ? "official" : "media-reported",
    confidence: Math.min(1, 0.45 + value.itemIds.length * 0.2),
    evidenceItemIds: value.itemIds,
  }));
}

function unsupportedValues(briefing: GundemBriefing): string[] {
  const claimValues = new Set((briefing.claims ?? []).flatMap((claim) => [claim.valueText, claim.subject].filter(Boolean).map((v) => normalize(v!))));
  return valuesIn(`${briefing.title} ${briefing.excerpt} ${briefing.bodyMarkdown}`)
    .filter((value) => !claimValues.has(value));
}

function repeatedParagraphStarts(body: string): string[] {
  const starts = body.split(/\n\n+/).map((p) => tokens(p).slice(0, 4).join(" ")).filter(Boolean);
  return starts.filter((start, index) => starts.indexOf(start) !== index);
}

export type NewsQualityResult =
  | { ok: true; riskLevel: NewsRiskLevel; requiresReview: boolean }
  | { ok: false; code: string; hits: string[]; riskLevel: NewsRiskLevel; requiresReview: boolean };

export function assessNewsQuality(
  briefing: GundemBriefing,
  items: readonly TrMediaFeedItem[],
): NewsQualityResult {
  const combined = `${briefing.title}\n${briefing.excerpt}\n${briefing.bodyMarkdown}`;
  const hasOfficial = briefing.sources.some((source) => {
    if (source.sourceType !== "official") return false;
    try {
      const url = new URL(source.url);
      return url.pathname !== "/" && url.pathname.length > 4;
    } catch {
      return false;
    }
  });
  const riskLevel = classifyNewsRisk(combined, hasOfficial);
  const requiresReview = riskLevel === "high" || riskLevel === "prohibited";
  const fail = (code: string, hits: string[]): NewsQualityResult => ({ ok: false, code, hits, riskLevel, requiresReview });

  if (riskLevel === "prohibited") return fail("prohibited-noise", ["noise-or-private-leak"]);
  if (briefing.title.length > 110 || CLICKBAIT_RE.test(briefing.title)) return fail("headline-quality", [briefing.title]);
  if (briefing.excerpt.length < 140 || briefing.excerpt.length > 220 || FILLER_RE.test(briefing.excerpt)) {
    return fail("excerpt-quality", [`length:${briefing.excerpt.length}`]);
  }
  const paragraphs = briefing.bodyMarkdown.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length < 2 || TUTORIAL_LEDE_RE.test(paragraphs[0] ?? "") || FILLER_RE.test(paragraphs[0] ?? "")) {
    return fail("lede-quality", [paragraphs[0] ?? "missing"]);
  }
  const duplicateStarts = repeatedParagraphStarts(briefing.bodyMarkdown);
  if (duplicateStarts.length) return fail("repeated-template", duplicateStarts);
  const unsupported = unsupportedValues(briefing);
  if (unsupported.length) return fail("unsupported-number", unsupported.slice(0, 5));

  for (const item of items) {
    const reference = `${item.title} ${item.descriptionSnippet ?? ""}`;
    if (overlapRatio(briefing.bodyMarkdown, reference) > 0.15) return fail("source-8gram-overlap", [item.feedId]);
    const body10 = ngrams(briefing.bodyMarkdown, 10);
    for (const gram of ngrams(reference, 10)) if (body10.has(gram)) return fail("source-10word-copy", [item.feedId]);
  }
  if (!hasOfficial && DEFINITE_RE.test(combined) && items.every((item) => item.sourceType !== "official")) {
    return fail("unsupported-certainty", ["media-only-definite-language"]);
  }
  return { ok: true, riskLevel, requiresReview };
}

export function newsroomFactsForPrompt(items: readonly TrMediaFeedItem[]): string {
  return items.map((item, index) => [
    `E${index + 1}`,
    `source=${item.feedLabel}`,
    `publisherGroup=${item.publisherGroupId}`,
    `type=${item.sourceType}`,
    `published=${item.pubDate ?? "unknown"}`,
    `title=${item.title}`,
    item.descriptionSnippet ? `snippet=${item.descriptionSnippet}` : "",
  ].filter(Boolean).join(" | ")).join("\n");
}

export function sourceLooksExactOfficial(sourceUrl: string, sourceType?: string): boolean {
  if (sourceType !== "official") return false;
  const url = new URL(sourceUrl);
  return url.pathname !== "/" && url.pathname.length > 4 && OFFICIAL_SIGNAL_RE.test(url.hostname + url.pathname);
}
