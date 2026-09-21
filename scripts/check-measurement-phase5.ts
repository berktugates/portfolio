/**
 * Faz 5 DoD — prod ölçüm yüzeyi (GTM, sitemap, llms); GSC export opsiyonel uyarı.
 */
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

  const gsc = await loadGscExport(root);
  if (!gsc?.totals?.clicks && !gsc?.queries?.length) {
    console.warn("WARN gsc-export: data/gsc-performance-export.json missing or empty (dashboard export)");
    warns += 1;
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
