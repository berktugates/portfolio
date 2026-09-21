/**
 * Faz 5 DoD — prod ölçüm yüzeyi (GTM, sitemap, llms); GSC export opsiyonel uyarı.
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { collectMeasurement, loadGscExport } from "./lib/measurement-collect";

const root = resolve(import.meta.dirname, "..");

async function main() {
  const data = await collectMeasurement(root);
  let errors = 0;
  let warns = 0;

  for (const p of data.gtmGa.probes) {
    if (!p.ok) {
      console.error(`FAIL ${p.id}: ${p.detail}`);
      errors += 1;
    } else {
      console.log(`OK ${p.id}: ${p.detail}`);
    }
  }

  let gsc = await loadGscExport(root);
  const gscConfigured = Boolean(
    process.env.GSC_SERVICE_ACCOUNT_JSON?.trim() || process.env.GSC_SERVICE_ACCOUNT_PATH?.trim(),
  );
  if (!gsc?.totals?.clicks && !gsc?.queries?.length) {
    try {
      const baseline = JSON.parse(
        await readFile(resolve(root, "docs/gsc-performance-baseline.snapshot.json"), "utf8"),
      ) as { totals?: { clicks?: number }; queries?: unknown[] };
      if (baseline.totals?.clicks || baseline.queries?.length) {
        gsc = baseline as typeof gsc;
      }
    } catch {
      /* no baseline */
    }
  }
  if (!gsc?.totals?.clicks && !gsc?.queries?.length) {
    if (gscConfigured) {
      console.error("FAIL gsc-export: GSC credentials set but data/gsc-performance-export.json missing or empty");
      errors += 1;
    } else {
      console.log("OK gsc-export: skipped (set GSC_SERVICE_ACCOUNT_JSON for Search Console API sync)");
    }
  } else {
    console.log(
      `OK gsc-export: ${gsc.queries?.length ?? 0} queries, clicks=${gsc.totals?.clicks ?? "?"}`,
    );
  }

  console.log(`\nFaz 5 measurement: ${errors} error(s), ${warns} warning(s).`);
  if (errors > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
