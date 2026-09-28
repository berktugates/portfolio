/** Google AdSense — yalnızca izin verilen haberler sayfalarında yüklenir. */

const DEFAULT_CLIENT_ID = "ca-pub-2056987543720599";

function clientId(): string | null {
  const raw = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() || DEFAULT_CLIENT_ID;
  if (!raw || !/^ca-pub-\d+$/.test(raw)) return null;
  return raw;
}

export function haberlerAdsenseEnabled(): boolean {
  return clientId() !== null;
}

export function haberlerAdsenseClientId(): string | null {
  return clientId();
}
