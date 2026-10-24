import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export type GscPerformanceExport = {
  exportedAt?: string;
  period?: string;
  site?: string;
  source?: string;
  totals?: {
    clicks?: number;
    impressions?: number;
    ctr?: number;
    position?: number;
  };
  queries?: { query: string; clicks?: number; impressions?: number; ctr?: number }[];
};

export function parseGscExportAgeDays(exportedAt: string | undefined): number | null {
  if (!exportedAt?.trim()) return null;
  const t = Date.parse(exportedAt);
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / (24 * 60 * 60 * 1000));
}

export async function syncGscBaselineSnapshot(root: string, source: string): Promise<GscPerformanceExport> {
  const exportPath = resolve(root, "data/gsc-performance-export.json");
  const baselinePath = resolve(root, "docs/gsc-performance-baseline.snapshot.json");
  const raw = await readFile(exportPath, "utf8");
  const j = JSON.parse(raw) as GscPerformanceExport;
  const out: GscPerformanceExport = {
    exportedAt: j.exportedAt,
    period: j.period ?? "28d",
    site: j.site ?? "sc-domain:berktugberke.com",
    source,
    totals: j.totals,
    queries: j.queries ?? [],
  };
  await writeFile(baselinePath, `${JSON.stringify(out, null, 2)}\n`);
  return out;
}
