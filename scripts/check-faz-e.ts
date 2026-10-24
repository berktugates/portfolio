/**
 * Faz E DoD — GTM/GA4 dataLayer, Cloudflare/Vercel yüzey, snapshot; E2E: pnpm test:e2e:prod (CI).
 */
import { resolve } from "node:path";
import { loadOpsEnv } from "./lib/load-ops-env";
import { runCfVercelProbes } from "./lib/cf-vercel-probes";
import { validateCfVercelSnapshot } from "./lib/cf-vercel-snapshot";
import { runDatalayerProbes } from "./lib/datalayer-probes";

const root = resolve(import.meta.dirname, "..");

function log(ok: boolean, id: string, detail: string): number {
  if (!ok) {
    console.error(`FAIL ${id}: ${detail}`);
    return 1;
  }
  console.log(`OK ${id}: ${detail}`);
  return 0;
}

async function main() {
  loadOpsEnv(root);
  let errors = 0;

  for (const p of await runCfVercelProbes(root)) {
    errors += log(p.ok, p.id, p.detail);
  }

  for (const p of await runDatalayerProbes()) {
    errors += log(p.ok, p.id, p.detail);
  }

  const snap = await validateCfVercelSnapshot(root);
  errors += log(snap.ok, "cf-vercel-snapshot", snap.detail);

  if (errors > 0) {
    console.error(`\nFaz E check: ${errors} error(s).`);
    process.exit(1);
  }
  console.log("\nFaz E check: 0 error(s). E2E: pnpm test:e2e:prod (CI: e2e-prod-smoke.yml).");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
