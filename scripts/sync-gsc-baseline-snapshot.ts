/**
 * `data/gsc-performance-export.json` → committed `docs/gsc-performance-baseline.snapshot.json`.
 */
import { resolve } from "node:path";
import { syncGscBaselineSnapshot } from "./lib/gsc-baseline-sync";

const root = resolve(import.meta.dirname, "..");

async function main() {
  const j = await syncGscBaselineSnapshot(root, "pnpm ops:sync-gsc-baseline");
  console.log(
    `Wrote docs/gsc-performance-baseline.snapshot.json (${j.queries?.length ?? 0} queries, clicks=${j.totals?.clicks ?? "?"}, exportedAt=${j.exportedAt})`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
