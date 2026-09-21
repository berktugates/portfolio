/**
 * GSC sorgu export → gundem-demand-signals.json (Trends ile birleşik talep şeridi).
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { GundemCategory } from "../app/lib/gundem/editorial";

const root = resolve(import.meta.dirname, "..");

type Signal = { query: string; weight: number; category?: GundemCategory };

function guessCategory(query: string): GundemCategory {
  const q = query.toLocaleLowerCase("tr");
  if (/altın|dolar|enflasyon|faiz|borsa|kira|maaş|ücret|zam|vergi|market/.test(q)) return "ekonomi";
  if (/seçim|meclis|bakan|cumhur|parti/.test(q)) return "siyaset";
  if (/deprem|yangın|trafik|güvenlik/.test(q)) return "toplum";
  if (/sağlık|hastane|grip|aşı/.test(q)) return "saglik";
  if (/maç|futbol|şampiyon/.test(q)) return "spor";
  return "diger";
}

async function main() {
  const gscPath = resolve(root, "data/gsc-performance-export.json");
  const demandPath = resolve(root, "data/gundem-demand-signals.json");
  const gscRaw = JSON.parse(await readFile(gscPath, "utf8")) as {
    exportedAt?: string;
    queries?: { query: string; clicks?: number; impressions?: number }[];
  };
  const demand = JSON.parse(await readFile(demandPath, "utf8")) as {
    queries: Signal[];
  };

  const byQuery = new Map<string, Signal>();
  for (const s of demand.queries) {
    byQuery.set(s.query.toLocaleLowerCase("tr"), s);
  }

  for (const row of gscRaw.queries ?? []) {
    const key = row.query.toLocaleLowerCase("tr").trim();
    if (!key || key.length < 3) continue;
    const weight = Math.min(25, Math.max(5, Math.round((row.clicks ?? 0) * 2 + (row.impressions ?? 0) / 100)));
    const existing = byQuery.get(key);
    if (existing) {
      existing.weight = Math.max(existing.weight, weight);
    } else {
      byQuery.set(key, { query: row.query.trim(), weight, category: guessCategory(row.query) });
    }
  }

  const merged = {
    updatedAt: new Date().toISOString().slice(0, 10),
    source: "Google Trends TR RSS + GSC export + manuel şerit",
    gscExportedAt: gscRaw.exportedAt,
    queries: [...byQuery.values()].sort((a, b) => b.weight - a.weight),
  };

  await writeFile(demandPath, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`Merged ${merged.queries.length} demand signals → data/gundem-demand-signals.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
