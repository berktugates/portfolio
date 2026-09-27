/** Türkçe haber başlığı / cümle — telif riskini düşürmek için hafif yeniden ifade (anlam korunur). */

export type ParaphraseStrength = "light" | "medium";

const LIGHT_PHRASES: readonly (readonly [RegExp, string])[] = [
  [/\bson dakika\b/giu, "günün ilerleyen saatlerinde"],
  [/\bbeklenmedik\b/giu, "sürpriz"],
  [/\bbeklenen\b/giu, "öngörülen"],
  [/\baçıkladı\b/giu, "duyurdu"],
  [/\baçıklama\b/giu, "duyuru"],
  [/\bbildirdi\b/giu, "aktardı"],
  [/\bçıktı\b/giu, "ortaya çıktı"],
  [/\byükseldi\b/giu, "artış gösterdi"],
  [/\bdüştü\b/giu, "geriledi"],
  [/\barttı\b/giu, "yükseldi"],
  [/\bazaldı\b/giu, "düştü"],
  [/\bkararı\b/giu, "tedbiri"],
  [/\bkarar\b/giu, "tedbir"],
  [/\biddia\b/giu, "söylenti"],
  [/\biddialara göre\b/giu, "aktarılan bilgilere göre"],
  [/\brekor\b/giu, "zirve"],
  [/\btartışma\b/giu, "gündem maddesi"],
  [/\bşok\b/giu, "sürpriz"],
  [/\bflaş\b/giu, "gündem"],
];

const MEDIUM_PHRASES: readonly (readonly [RegExp, string])[] = [
  ...LIGHT_PHRASES,
  [/\bve\b/giu, "ile"],
  [/\biçin\b/giu, "amacıyla"],
  [/\bgöre\b/giu, "doğrultusunda"],
  [/\bsonra\b/giu, "ardından"],
  [/\bönce\b/giu, "evvel"],
  [/\bçok\b/giu, "oldukça"],
  [/\b daha\b/giu, " bir hayli"],
];

function normalizeForCompare(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
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

/** 0–1; 1 = birebir aynı normalize metin. */
export function textSimilarity(a: string, b: string): number {
  const x = normalizeForCompare(a);
  const y = normalizeForCompare(b);
  if (!x || !y) return 0;
  const dist = levenshtein(x, y);
  return 1 - dist / Math.max(x.length, y.length);
}

function applyPhraseMap(text: string, map: readonly (readonly [RegExp, string])[]): string {
  let out = text;
  for (const [re, repl] of map) {
    out = out.replace(re, repl);
  }
  return out;
}

/** İlk cümlede özne–yüklem sırasını hafifçe kaydırır (yalnızca medium). */
function maybeReorderLeadClause(sentence: string, strength: ParaphraseStrength): string {
  if (strength !== "medium") return sentence;
  const parts = sentence.split(/,\s+/);
  if (parts.length === 2 && parts[0].length > 20 && parts[1].length > 15) {
    return `${parts[1].charAt(0).toLocaleUpperCase("tr") + parts[1].slice(1)}, ${parts[0].charAt(0).toLocaleLowerCase("tr") + parts[0].slice(1)}`;
  }
  return sentence;
}

/**
 * Hafif yeniden ifade: çoğu kelime ve özel isimler korunur (~%75–90 benzerlik hedefi).
 * Ajans metni kopyası değil; arama gündemindeki kısa başlıklar için.
 */
export function lightParaphraseTurkish(
  text: string,
  strength: ParaphraseStrength = "light",
): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;

  const map = strength === "medium" ? MEDIUM_PHRASES : LIGHT_PHRASES;
  const sentences = trimmed.split(/(?<=[.!?…])\s+/);
  const out = sentences.map((s) => {
    let line = applyPhraseMap(s, map);
    line = maybeReorderLeadClause(line, strength);
    return line;
  });

  return out.join(" ").replace(/\s+/g, " ").trim();
}

/** Başlık telif eşiğinin üstündeyse bir kez daha güçlendir. */
export function paraphraseUntilBelowSimilarity(
  text: string,
  reference: string,
  maxSimilarity: number,
  strength: ParaphraseStrength = "light",
): string {
  let current = text;
  let sim = textSimilarity(current, reference);
  if (sim <= maxSimilarity) return current;

  current = lightParaphraseTurkish(current, strength);
  sim = textSimilarity(current, reference);
  if (sim <= maxSimilarity) return current;

  if (strength === "light") {
    current = lightParaphraseTurkish(current, "medium");
  }
  return current;
}
