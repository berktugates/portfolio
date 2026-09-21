/**
 * Faz 5 — GTM/GSC/GA4 yüzey doğrulaması (API anahtarı olmadan prod HTML + sitemap + opsiyonel export).
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { HABERLER_ORIGIN } from "../../app/lib/gundem/hosts";

const GTM_EXPECTED = "GTM-K2PXS8ZC";
const GA4_EXPECTED = "G-5H6GDB1CRH";
const SITE = "https://berktugberke.com";

export type MeasurementProbe = { id: string; ok: boolean; detail: string };

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url} HTTP ${res.status}`);
  return res.text();
}

export async function probeGtmOnPage(url: string, label: string): Promise<MeasurementProbe> {
  try {
    const html = await fetchText(url);
    const hasGtm = html.includes(GTM_EXPECTED) || html.includes("googletagmanager.com/gtm.js");
    const hasDirectGa = html.includes(GA4_EXPECTED) && html.includes("gtag/js");
    if (!hasGtm) {
      return { id: `gtm-${label}`, ok: false, detail: `${url} missing GTM container ${GTM_EXPECTED}` };
    }
    if (hasDirectGa) {
      return {
        id: `gtm-${label}`,
        ok: false,
        detail: `${url} has direct gtag.js with GA4 — double-count risk with GTM`,
      };
    }
    return { id: `gtm-${label}`, ok: true, detail: `${label}: GTM present, no duplicate gtag` };
  } catch (error) {
    return {
      id: `gtm-${label}`,
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function probeLlmsHaberler(): Promise<MeasurementProbe> {
  try {
    const text = await fetchText(`${SITE}/llms.txt`);
    const ok = text.includes("haberler.berktugberke.com") && text.includes("Gündem");
    return {
      id: "llms-haberler",
      ok,
      detail: ok ? "llms.txt cites haberler gündem" : "llms.txt missing haberler gündem block",
    };
  } catch (error) {
    return {
      id: "llms-haberler",
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function countSitemapLocs(url: string): Promise<number> {
  const xml = await fetchText(url);
  return [...xml.matchAll(/<loc>/g)].length;
}

export async function probeSitemapInventory(): Promise<MeasurementProbe[]> {
  const probes: MeasurementProbe[] = [];
  try {
    const main = await countSitemapLocs(`${SITE}/sitemap.xml`);
    probes.push({
      id: "sitemap-main-count",
      ok: main >= 50,
      detail: `main sitemap locs: ${main}`,
    });
  } catch (error) {
    probes.push({
      id: "sitemap-main-count",
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    });
  }
  try {
    const gundem = await countSitemapLocs(`${HABERLER_ORIGIN}/sitemap-gundem.xml`);
    probes.push({
      id: "sitemap-gundem-count",
      ok: gundem >= 4,
      detail: `haberler sitemap locs: ${gundem}`,
    });
  } catch (error) {
    probes.push({
      id: "sitemap-gundem-count",
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    });
  }
  return probes;
}

export type GscExport = {
  exportedAt?: string;
  period?: string;
  totals?: { clicks?: number; impressions?: number };
  queries?: { query: string; clicks?: number; impressions?: number; ctr?: number }[];
};

export async function loadGscExport(root: string): Promise<GscExport | null> {
  const path = resolve(root, "data/gsc-performance-export.json");
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw) as GscExport;
  } catch {
    return null;
  }
}

export async function collectMeasurement(root: string) {
  const gtmProbes = await Promise.all([
    probeGtmOnPage(SITE, "portfolio"),
    probeGtmOnPage(`${SITE}/blogs`, "blogs"),
    probeGtmOnPage(HABERLER_ORIGIN, "haberler"),
  ]);
  const llms = await probeLlmsHaberler();
  const sitemaps = await probeSitemapInventory();
  const gscExport = await loadGscExport(root);

  return {
    gtmGa: {
      container: GTM_EXPECTED,
      ga4: GA4_EXPECTED,
      gscProperty: "sc-domain:berktugberke.com",
      probes: [...gtmProbes, llms, ...sitemaps],
    },
    gscExport: gscExport
      ? {
          exportedAt: gscExport.exportedAt,
          period: gscExport.period,
          totals: gscExport.totals,
          queryCount: gscExport.queries?.length ?? 0,
        }
      : { note: "data/gsc-performance-export.json yok; GSC dashboard export eklenebilir" },
  };
}
