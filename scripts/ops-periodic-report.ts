/**
 * Yerel periyodik ops özeti — secret yoksa beklenen WARN/skip’leri listeler.
 */
import { resolve } from "node:path";
import { loadDotenvLocal } from "./lib/load-dotenv-local";
import { contentPublicBaseUrl } from "./lib/content-public-base";

const root = resolve(import.meta.dirname, "..");

function flag(label: string, ok: boolean, detail: string) {
  console.log(`${ok ? "OK" : "WARN"} ${label}: ${detail}`);
}

async function main() {
  loadDotenvLocal(root);

  flag("vercel-token", Boolean(process.env.VERCEL_TOKEN?.trim()), process.env.VERCEL_TOKEN ? "set → ops:collect / ops:prune-deployments" : "unset → CI secret veya .env.local");
  flag(
    "manual-cron-secret",
    Boolean(process.env.MANUAL_CRON_SECRET?.trim()),
    process.env.MANUAL_CRON_SECRET ? "set → check:gds-ops /ops/growthdaily" : "unset → Worker secret; check:gds-ops skips ops API",
  );
  const base = contentPublicBaseUrl();
  flag(
    "content-public-base",
    Boolean(base),
    base ? base : "unset → gundem:verify-r2 index skip; smoke R2 image pass skip",
  );
  const gsc = Boolean(
    process.env.GSC_SERVICE_ACCOUNT_JSON?.trim() || process.env.GSC_SERVICE_ACCOUNT_PATH?.trim(),
  );
  flag(
    "gsc-service-account",
    gsc,
    gsc ? "set → pnpm ops:gsc-sync live fetch" : "unset → ops:gsc-sync merges export or baseline snapshot",
  );
}

main();
