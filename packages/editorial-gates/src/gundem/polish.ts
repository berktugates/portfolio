import type { GundemBriefing } from "./types";
import type { TrendNewsHeadline } from "./trends";
import { lightParaphraseTurkish, paraphraseUntilBelowSimilarity, type ParaphraseStrength } from "./paraphrase-tr";

const HEADLINE_TITLE_MAX_SIM = 0.82;
const LEGAL_FOOTER =
  "Kaynak notu: Metinde geçen olay özetleri, arama gündeminde görünen medya başlıklarından yola çıkarak editöryal olarak yeniden ifade edilmiştir; ajans tel metni veya birebir kopya değildir. Resmi rakam, tarih ve kararlar için sayfa altındaki birincil kurum bağlantıları esas alınmalıdır.";

export type GundemPolishOptions = {
  paraphraseStrength?: ParaphraseStrength;
  /** Trends / RSS’teki ham başlıklar — başlık benzerlik kontrolü. */
  referenceHeadlines?: readonly TrendNewsHeadline[];
};

function uniqueOutlets(headlines: readonly TrendNewsHeadline[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const h of headlines) {
    const name = h.source?.trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    out.push(name);
    if (out.length >= 4) break;
  }
  return out;
}

function polishParagraph(text: string, strength: ParaphraseStrength): string {
  return lightParaphraseTurkish(text, strength);
}

/** Headlines kaynaklı brifinglerde hukuk + editöryal son rötuş. */
export function polishHeadlinesBriefing(
  briefing: GundemBriefing,
  options: GundemPolishOptions = {},
): GundemBriefing {
  const strength = options.paraphraseStrength ?? "light";
  const refs = options.referenceHeadlines ?? [];
  const refTitles = refs.map((h) => h.title).filter(Boolean);
  const primaryRef = refTitles[0] ?? "";

  let title = briefing.title;
  if (primaryRef) {
    title = paraphraseUntilBelowSimilarity(title, primaryRef, HEADLINE_TITLE_MAX_SIM, strength);
    if (title.length > 92) {
      const q = briefing.trendQuery ?? "Gündem";
      title = `${q.charAt(0).toLocaleUpperCase("tr") + q.slice(1)}: günün özeti`;
    }
  } else {
    title = lightParaphraseTurkish(title, strength);
  }

  const excerpt = polishParagraph(briefing.excerpt, strength);
  const paragraphs = briefing.bodyMarkdown.split(/\n\n+/).filter(Boolean);
  const outlets = uniqueOutlets(refs);
  if (outlets.length > 0 && !paragraphs.some((p) => p.includes("gündeme yansıdı"))) {
    paragraphs.push(
      `Özetlenen başlıklar ${outlets.join(", ")} gibi yayınlarda gün içinde öne çıktı.`,
    );
  }
  if (!paragraphs.some((p) => p.includes("ajans tel metni"))) {
    paragraphs.push(LEGAL_FOOTER);
  }

  return {
    ...briefing,
    title,
    excerpt,
    bodyMarkdown: paragraphs.join("\n\n"),
  };
}
