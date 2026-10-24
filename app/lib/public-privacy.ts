/** Metinlerin kamuya açık HTML/JSON/llms yüzeylerinde görünmemesi gereken parçalar. */

const FORBIDDEN_EMAIL = /contact@berktugberke\.com/gi;

/** Kişisel ikamet / bölge ifadeleri — haber içeriği değil, yayıncı profili için. */
const FORBIDDEN_GEO =
  /(?:Türkiye|Ege Bölgesi|Ege bolgesi|Muğla|Mugla|Marmaris|İstanbul|Istanbul)/giu;

export function stripForbiddenPublicText(text: string): string {
  return text.replace(FORBIDDEN_EMAIL, "").replace(FORBIDDEN_GEO, "").replace(/\s{2,}/g, " ").trim();
}

export function textContainsForbiddenPublicEmail(text: string): boolean {
  FORBIDDEN_EMAIL.lastIndex = 0;
  return FORBIDDEN_EMAIL.test(text);
}

export function textContainsForbiddenPublicGeo(text: string): boolean {
  FORBIDDEN_GEO.lastIndex = 0;
  return FORBIDDEN_GEO.test(text);
}

/** Env'den gelen künye alanı — yasaklı parça varsa yayınlama. */
export function sanitizePublicationField(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (textContainsForbiddenPublicEmail(trimmed) || textContainsForbiddenPublicGeo(trimmed)) {
    return null;
  }
  return trimmed;
}
