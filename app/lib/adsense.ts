/** Google AdSense — paylaşılan yayıncı kimliği. */

const DEFAULT_CLIENT_ID = "ca-pub-2056987543720599";

export function adsenseClientId(): string | null {
  const raw = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() || DEFAULT_CLIENT_ID;
  if (!raw || !/^ca-pub-\d+$/.test(raw)) return null;
  return raw;
}

export function adsenseEnabled(): boolean {
  return adsenseClientId() !== null;
}

/** Opsiyonel manuel display slot (AdSense → Reklamlar → Görüntülü). */
export function adsenseDisplaySlot(kind: "haberler" | "blog" | "home"): string | null {
  const envKey =
    kind === "haberler"
      ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_HABERLER
      : kind === "blog"
        ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG
        : process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME;
  const slot = envKey?.trim();
  return slot && /^\d+$/.test(slot) ? slot : null;
}
