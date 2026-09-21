/**
 * Committed GSC snapshot → gitignore export + demand merge (API secret olmadan).
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const baselinePath = resolve(root, "docs/gsc-performance-baseline.snapshot.json");
const exportPath = resolve(root, "data/gsc-performance-export.json");

async function main() {
  const raw = await readFile(baselinePath, "utf8");
  const j = JSON.parse(raw) as {
    exportedAt?: string;
    period?: string;
    totals?: { clicks?: number; impressions?: number };
    queries?: { query: string; clicks?: number; impressions?: number; ctr?: number }[];
  };
  const out = {
    exportedAt: j.exportedAt,
    period: j.period ?? "28d",
    totals: j.totals,
    queries: j.queries ?? [],
  };
  await writeFile(exportPath, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`Wrote ${exportPath} from baseline snapshot (${out.queries.length} queries).`);
  execSync("pnpm ops:merge-gsc-demand", { cwd: root, stdio: "inherit" });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
