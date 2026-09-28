/** Google AdSense — yalnızca haberler host; env yoksa reklam render edilmez. */

export type HaberlerAdPlacement =
  | "left-rail"
  | "right-rail"
  | "mobile-banner"
  | "article-footer";

function clientId(): string | null {
  const raw = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
  if (!raw || !/^ca-pub-\d+$/.test(raw)) return null;
  return raw;
}

function slotFor(placement: HaberlerAdPlacement): string | undefined {
  const map: Record<HaberlerAdPlacement, string | undefined> = {
    "left-rail": process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEFT?.trim(),
    "right-rail": process.env.NEXT_PUBLIC_ADSENSE_SLOT_RIGHT?.trim(),
    "mobile-banner": process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE?.trim(),
    "article-footer": process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE?.trim(),
  };
  const slot = map[placement];
  return slot && /^\d+$/.test(slot) ? slot : undefined;
}

export function haberlerAdsenseEnabled(): boolean {
  return clientId() !== null;
}

export function haberlerAdsenseClientId(): string | null {
  return clientId();
}

export function haberlerAdSlot(placement: HaberlerAdPlacement): string | undefined {
  if (!haberlerAdsenseEnabled()) return undefined;
  return slotFor(placement);
}

/** Slot yoksa AdSense auto format (onay sonrası slot eklenince override edilir). */
export function haberlerAdFormat(placement: HaberlerAdPlacement): string {
  if (placement === "left-rail" || placement === "right-rail") return "vertical";
  return "auto";
}
