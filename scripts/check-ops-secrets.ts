/**
 * Ops secret env özeti — CI’da eksik GitHub secret’ları fail-closed (OPS_STRICT_SECRETS=1 varsayılan CI’da).
 */
import { resolve } from "node:path";
import { listMissingOpsSecrets, loadOpsEnv, opsSecretStatus, type OpsSecretId } from "./lib/load-ops-env";

const root = resolve(import.meta.dirname, "..");

const HINTS: Record<OpsSecretId, string> = {
  VERCEL_TOKEN: "GitHub secret VERCEL_TOKEN veya .env.local — ops:collect / prune",
  MANUAL_CRON_SECRET: "GitHub secret (Worker wrangler secret ile aynı) — check:gds-ops /ops/growthdaily",
  CONTENT_PUBLIC_BASE_URL: "GitHub secret veya pnpm ops:env-pull — gundem:verify-r2 R2 index",
  GSC_SERVICE_ACCOUNT: "GitHub secret GSC_SERVICE_ACCOUNT_JSON — ops:gsc-sync canlı fetch",
};

async function main() {
  loadOpsEnv(root);
  const status = opsSecretStatus();
  let errors = 0;
  let warns = 0;

  for (const [id, ok] of Object.entries(status) as [OpsSecretId, boolean][]) {
    if (ok) console.log(`OK ops-secret:${id}`);
    else console.log(`MISS ops-secret:${id} — ${HINTS[id]}`);
  }

  const ciRequired: OpsSecretId[] = ["VERCEL_TOKEN", "CONTENT_PUBLIC_BASE_URL"];
  const ciOptional: OpsSecretId[] = ["MANUAL_CRON_SECRET", "GSC_SERVICE_ACCOUNT"];
  const inCi = process.env.CI === "true";
  const localStrict = process.env.OPS_STRICT_SECRETS === "1";

  if (inCi) {
    for (const id of ciRequired) {
      if (!status[id]) {
        console.error(`FAIL ops-secret:${id}: required in CI — ${HINTS[id]}`);
        errors += 1;
      }
    }
    for (const id of ciOptional) {
      if (!status[id]) {
        console.log(`WARN ops-secret:${id}: unset in CI — ${HINTS[id]}`);
        warns += 1;
      }
    }
  } else if (localStrict) {
    for (const id of listMissingOpsSecrets()) {
      console.error(`FAIL ops-secret:${id}: OPS_STRICT_SECRETS=1 — ${HINTS[id]}`);
      errors += 1;
    }
  } else {
    const missing = listMissingOpsSecrets();
    if (missing.length > 0) {
      console.log(
        `WARN ops-secrets: ${missing.length} unset (pnpm ops:env-pull + GitHub secrets; ops-phase0 CI tam kapasite)`,
      );
      warns += 1;
    }
  }

  console.log(`\nOps secrets: ${errors} error(s), ${warns} warning(s).`);
  if (errors > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
