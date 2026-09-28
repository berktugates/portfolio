import { lightParaphraseTurkish, type ParaphraseStrength } from "./paraphrase-tr";
import type { TrendNewsHeadline } from "./trends";

/** Başlıkta olay / rakam sinyali — güncel haber cümlesi üretimi. */
const EVENT_VERB_RE =
  /\b(oldu|oluyor|olduğu|olacak|transfer|imzalandı|açıklandı|açıkladı|duyurdu|duyuruldu|bildirdi|güncellendi|yükseldi|düştü|arttı|azaldı|onaylandı|karar|rekor|zirve|çıktı|geldi|gündeme geldi|bitti|başladı|başlayacak|gerçekleşti|gerçekleşecek|girecek|sürecek|devam ediyor|hazırlanıyor|planlandı|bekleniyor|öngörülüyor|kutladı|toplandı|toplanacak|yapıldı|yapılacak|tamamlandı|bekliyor|yalanladı|reddetti|yasaklandı|kaldırıldı|tutuklandı|gözaltı|seçildi|atandı|istifa|zam|indirim|tavan|minimum|maksimum|final|galibiyet|mağlubiyet|beraberlik)\b/iu;

const NUMBER_RE = /\d+[,.]?\d*|\%\s*\d|₺|\$|€|euro|dolar|tl\b/i;

export function headlineFactScore(title: string): number {
  let score = 0;
  if (EVENT_VERB_RE.test(title)) score += 2;
  if (NUMBER_RE.test(title)) score += 2;
  if (title.length >= 24) score += 1;
  return score;
}

export function rankHeadlinesByFact(headlines: readonly TrendNewsHeadline[]): TrendNewsHeadline[] {
  return [...headlines].sort((a, b) => headlineFactScore(b.title) - headlineFactScore(a.title));
}

export function bodyHasCurrentEventSignals(body: string): boolean {
  const eventHits = (body.match(new RegExp(EVENT_VERB_RE.source, "giu")) ?? []).length;
  const numberHits = NUMBER_RE.test(body);
  if (eventHits >= 2) return true;
  if (eventHits >= 1 && numberHits) return true;
  // Feed-backed drafts already have a 36-hour evidence window and two-source
  // requirement; one explicit reporting verb is sufficient for events with no
  // material number (statements, schedules and denials).
  if (eventHits >= 1) return true;
  return false;
}

function formatTrDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return "Bugün";
  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  const month = months[Number(m[2]) - 1];
  return month ? `${Number(m[3])} ${month} ${m[1]}` : "Bugün";
}

/** Tek başlık → güncel olay cümlesi (paraphrase + kaynak etiketi). */
export function headlineToNewsSentence(
  headline: TrendNewsHeadline,
  strength: ParaphraseStrength,
): string {
  let fact = lightParaphraseTurkish(headline.title.trim(), strength);
  if (!/[.!?…]$/.test(fact)) fact = `${fact}.`;
  const outlet = headline.source?.trim();
  const tag = outlet
    ? ` (${outlet} ve benzeri yayınlarda gündeme yansıdı — editöryal özet.)`
    : " (Ulusal medyada gündeme yansıdı — editöryal özet.)";
  return `${fact}${tag}`;
}

export function buildGundemLede(
  query: string,
  topHeadline: TrendNewsHeadline,
  todayIso: string,
  strength: ParaphraseStrength,
): string {
  const dateLabel = formatTrDate(todayIso);
  const lead = lightParaphraseTurkish(topHeadline.title, strength);
  const q = query.charAt(0).toLocaleUpperCase("tr") + query.slice(1);
  return `${dateLabel} itibarıyla ${q} gündeminde öne çıkan gelişme: ${lead.replace(/[.!?…]$/, "")}. Aşağıda medyada öne çıkan diğer başlıkların kısa özeti var.`;
}
