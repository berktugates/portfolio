import { HABERLER_ORIGIN } from "../../app/lib/gundem/hosts";

/** Google News sitemap — yalnız son 48 saat; boş olması normal. */
export const GUNDEM_NEWS_SITEMAP_MIN_LOCS = 1;

/** Kalıcı haberler indeksi — 48h boşken check’ler buna düşer. */
export const HABERLER_MAIN_SITEMAP_MIN_LOCS = 10;

export type GundemSitemapIndexProbe = {
  news48h: number;
  haberMain: number;
  ok: boolean;
  detail: string;
};

async function fetchSitemapXml(url: string): Promise<string> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url} HTTP ${res.status}`);
  return res.text();
}

export async function countSitemapLocs(url: string): Promise<number> {
  const xml = await fetchSitemapXml(url);
  return [...xml.matchAll(/<loc>/g)].length;
}

export async function probeGundemSitemapIndex(): Promise<GundemSitemapIndexProbe> {
  const news48h = await countSitemapLocs(`${HABERLER_ORIGIN}/sitemap-gundem.xml`);
  const haberMain = await countSitemapLocs(`${HABERLER_ORIGIN}/sitemap.xml`);
  const ok = news48h >= GUNDEM_NEWS_SITEMAP_MIN_LOCS || haberMain >= HABERLER_MAIN_SITEMAP_MIN_LOCS;
  const detail =
    news48h >= GUNDEM_NEWS_SITEMAP_MIN_LOCS
      ? `sitemap-gundem.xml (48h): ${news48h} loc(s)`
      : `sitemap-gundem.xml empty (48h); haberler sitemap.xml fallback: ${haberMain} loc(s)`;
  return { news48h, haberMain, ok, detail };
}
