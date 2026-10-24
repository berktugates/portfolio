/**
 * Faz D DoD — prod JSON-LD probeleri + GSC URL inspection snapshot (check:measurement alt kümesi).
 */
import { resolve } from "node:path";
import { GDS_PROD_PUBLISHED_SLUG } from "../app/lib/gds-prod-fixtures";
import { validateGscUrlInspectionSnapshot } from "./lib/gsc-url-inspection-snapshot";
import { runSchemaProbes, type SchemaProbe } from "./lib/schema-probes";

const root = resolve(import.meta.dirname, "..");

function logProbe(p: SchemaProbe): boolean {
  if (!p.ok) {
    console.error(`FAIL ${p.id}: ${p.detail}`);
    return false;
  }
  console.log(`OK ${p.id}: ${p.detail}`);
  return true;
}

async function main() {
  let errors = 0;

  for (const p of await runSchemaProbes(GDS_PROD_PUBLISHED_SLUG)) {
    if (!logProbe(p)) errors += 1;
  }

  const gscInspect = await validateGscUrlInspectionSnapshot(root);
  if (!gscInspect.ok) {
    console.error(`FAIL gsc-inspection-snapshot: ${gscInspect.detail}`);
    errors += 1;
  } else {
    console.log(`OK gsc-inspection-snapshot: ${gscInspect.detail}`);
  }

  if (errors > 0) {
    console.error(`\nFaz D schema/GSC check: ${errors} error(s).`);
    process.exit(1);
  }
  console.log("\nFaz D schema/GSC check: 0 error(s).");
}

main();
