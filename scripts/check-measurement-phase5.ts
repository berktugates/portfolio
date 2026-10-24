/**
 * Faz 5 DoD — prod ölçüm yüzeyi (GTM, sitemap, llms); GSC export opsiyonel uyarı.
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { GDS_PROD_PUBLISHED_SLUG } from "../app/lib/gds-prod-fixtures";
import { parseGscExportAgeDays } from "./lib/gsc-baseline-sync";
import { loadOpsEnv } from "./lib/load-ops-env";
import { collectMeasurement, loadGscExport } from "./lib/measurement-collect";
import { runDatalayerProbes } from "./lib/datalayer-probes";
import { runSchemaProbes } from "./lib/schema-probes";

const root = resolve(import.meta.dirname, "..");

async function main() {
  loadOpsEnv(root);
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

  for (const p of await runSchemaProbes(GDS_PROD_PUBLISHED_SLUG)) {
    if (!p.ok) {
      console.error(`FAIL ${p.id}: ${p.detail}`);
      errors += 1;
    } else {
      console.log(`OK ${p.id}: ${p.detail}`);
    }
  }

  for (const p of await runDatalayerProbes()) {
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
      `OK gsc-export: ${gsc.queries?.length ?? 0} queries, clicks=${gsc.totals?.clicks ?? "?"}, exportedAt=${gsc.exportedAt ?? "?"}`,
    );
    const ageDays = parseGscExportAgeDays(gsc.exportedAt);
    const maxAge = gscConfigured ? 35 : 45;
    if (ageDays != null && ageDays > maxAge) {
      const msg = `GSC export ${ageDays}d old (max ${maxAge}d); ops:fetch-gsc or Search Console UI → ops:sync-gsc-baseline`;
      if (gscConfigured) {
        console.error(`FAIL gsc-freshness: ${msg}`);
        errors += 1;
      } else {
        console.log(`WARN gsc-freshness: ${msg}`);
        warns += 1;
      }
    } else if (ageDays != null && ageDays > 21) {
      console.log(`WARN gsc-freshness: export ${ageDays}d old; haftalık ops:gsc-sync hedefi ≤21d`);
      warns += 1;
    }
  }

  console.log(`\nFaz 5 measurement: ${errors} error(s), ${warns} warning(s).`);
  if (errors > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
