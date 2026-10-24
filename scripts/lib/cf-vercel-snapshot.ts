import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export type CfVercelSnapshot = {
  exportedAt?: string;
  gtmContainer?: string;
  ga4MeasurementId?: string;
  requiredProbeIds?: string[];
};

export const FAZ_E_REQUIRED_PROBE_IDS = [
  "cf-apex-vercel",
  "cf-haberler-vercel",
  "vercel-static-cache",
  "cf-indexnow-key",
  "dl-home-other",
  "dl-blog",
  "dl-hire",
  "dl-gundem",
  "gtm-no-double-config",
] as const;

export async function validateCfVercelSnapshot(root: string): Promise<{ ok: boolean; detail: string }> {
  try {
    const snap = JSON.parse(
      await readFile(resolve(root, "docs/cf-vercel.snapshot.json"), "utf8"),
    ) as CfVercelSnapshot;
    const required = new Set(snap.requiredProbeIds ?? FAZ_E_REQUIRED_PROBE_IDS);
    for (const id of FAZ_E_REQUIRED_PROBE_IDS) {
      if (!required.has(id)) {
        return { ok: false, detail: `snapshot missing probe id ${id}` };
      }
    }
    return {
      ok: true,
      detail: `GTM=${snap.gtmContainer ?? "?"}, GA4=${snap.ga4MeasurementId ?? "?"} (exportedAt=${snap.exportedAt ?? "?"})`,
    };
  } catch (error) {
    return { ok: false, detail: error instanceof Error ? error.message : String(error) };
  }
}
