import { CONTENT_SAFETY_PHRASE_ALLOWLIST } from "./content-safety-allowlist";

export type ContentSafetyInput = {
  title: string;
  body: string;
  excerpt?: string;
  alt?: string;
  sources?: readonly { url: string; title?: string }[];
  /** Assistant replies skip length/source headline rules. */
  mode?: "publish" | "assistant";
};

export type ContentSafetyResult =
  | { ok: true }
  | { ok: false; code: string; hits: string[] };

const PROFANITY_RE =
  /\b(fuck(?:ing|ed|er)?|shit(?:ty)?|bitch(?:es)?|asshole|cunt|motherfucker|dickhead|bastard|amk|aq\b|orospu|siktir|piç|yarrak|sikerim|mal\s*oç|oç\b|göt(?:ün|e)?|sik(?:em|er|ik)?)\b/iu;

const THREAT_RE =
  /\b(öldür|oldur|kill you|i will kill|seni gebert|gebertirim|burn your|yakacağım)\b/iu;

const DEFAMATION_RE =
  /\b(hırsız|dolandırıcı|pedofil|terörist|yalancı pezevenk)\b.*\b(o|şu|bu)\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]+/iu;

const SOURCE_HOST_ALLOWLIST = new Set([
  "berktugberke.com",
  "www.berktugberke.com",
  "developer.mozilla.org",
  "nextjs.org",
  "schema.org",
  "google.com",
  "developers.google.com",
  "w3.org",
  "github.com",
  "www.github.com",
  "cloudflare.com",
  "vercel.com",
  "owasp.org",
  "ietf.org",
]);

function normalizeForCompare(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text: string): number {
  const n = normalizeForCompare(text);
  if (!n) return 0;
  return n.split(" ").filter(Boolean).length;
}

function stripAllowlistedPhrases(text: string): string {
  let out = text;
  for (const phrase of CONTENT_SAFETY_PHRASE_ALLOWLIST) {
    out = out.replace(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), " ");
  }
  return out;
}

function findProfanityHits(text: string): string[] {
  const scrubbed = stripAllowlistedPhrases(text).slice(0, 50_000);
  const hits: string[] = [...(scrubbed.match(PROFANITY_RE) ?? [])];
  if (THREAT_RE.test(scrubbed)) hits.push("threat");
  if (DEFAMATION_RE.test(scrubbed)) hits.push("defamation-pattern");
  return hits;
}

function quotedBlocks(text: string): string[] {
  return [...text.matchAll(/"([^"]{40,})"/g)].map((m) => m[1]);
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function titleSimilarity(title: string, reference: string): number {
  const a = normalizeForCompare(title);
  const b = normalizeForCompare(reference);
  if (!a || !b) return 0;
  const dist = levenshtein(a, b);
  return 1 - dist / Math.max(a.length, b.length);
}

function hostFromUrl(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function assessContentSafety(input: ContentSafetyInput): ContentSafetyResult {
  const parts = [input.title, input.excerpt ?? "", input.body, input.alt ?? ""];
  const combined = parts.join("\n");
  const profanityHits = findProfanityHits(combined);
  if (profanityHits.length > 0) {
    return { ok: false, code: "profanity", hits: profanityHits };
  }

  if (input.mode !== "assistant") {
    const bodyWords = wordCount(input.body);
    if (bodyWords < 350) {
      return { ok: false, code: "thin-content", hits: [`word-count:${bodyWords}`] };
    }
  }

  if (input.mode !== "assistant" && input.sources?.length) {
    for (const source of input.sources) {
      const host = hostFromUrl(source.url);
      if (!host || !SOURCE_HOST_ALLOWLIST.has(host)) {
        return { ok: false, code: "source-host", hits: [source.url] };
      }
      if (source.title && titleSimilarity(input.title, source.title) > 0.85) {
        return { ok: false, code: "headline-copy", hits: [source.title] };
      }
    }
  }

  const quotes = quotedBlocks(input.body);
  if (quotes.length > 2) {
    return { ok: false, code: "excessive-quoting", hits: quotes.slice(0, 3) };
  }
  for (const quote of quotes) {
    if (wordCount(quote) > 40) {
      return { ok: false, code: "long-quote", hits: [`${wordCount(quote)} words`] };
    }
  }

  return { ok: true };
}
