/**
 * GSC export + gündem demand merge.
 * API yoksa: mevcut export veya committed baseline snapshot.
 */
import { access } from "node:fs/promises";
import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { loadOpsEnv } from "./lib/load-ops-env";

const root = resolve(import.meta.dirname, "..");
const exportPath = resolve(root, "data/gsc-performance-export.json");

function run(cmd: string) {
  execSync(cmd, { cwd: root, stdio: "inherit", env: process.env });
}

async function exportExists(): Promise<boolean> {
  try {
    await access(exportPath);
    return true;
  } catch {
    return false;
  }
}

function hasGscCredentials(): boolean {
  return Boolean(
    process.env.GSC_SERVICE_ACCOUNT_JSON?.trim() || process.env.GSC_SERVICE_ACCOUNT_PATH?.trim(),
  );
}

async function main() {
  loadOpsEnv(root);

  if (hasGscCredentials()) {
    run("node --import tsx scripts/fetch-gsc-performance-export.ts");
    run("node --import tsx scripts/merge-gsc-demand-signals.ts");
    return;
  }

  if (await exportExists()) {
    console.log("GSC fetch skipped (no service account); merging existing export.");
    run("node --import tsx scripts/merge-gsc-demand-signals.ts");
    return;
  }

  console.log("GSC fetch skipped; seeding export from docs/gsc-performance-baseline.snapshot.json");
  run("node --import tsx scripts/import-gsc-baseline-snapshot.ts");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
