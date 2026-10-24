/**
 * Yerel periyodik ops + ürün sürekliliği özeti.
 */
import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { contentPublicBaseUrl } from "./lib/content-public-base";
import { probeGundemSitemapIndex } from "./lib/gundem-sitemap-probe";
import { loadDotenvLocal } from "./lib/load-dotenv-local";
import { istanbulCalendarDay } from "./lib/istanbul-calendar-day";

const root = resolve(import.meta.dirname, "..");
const BLOG_QUEUE_MIN = 7;
const BLOG_QUEUE_RUNWAY = 9;

function flag(label: string, ok: boolean, detail: string) {
  console.log(`${ok ? "OK" : "WARN"} ${label}: ${detail}`);
}

async function main() {
  loadDotenvLocal(root);

  flag(
    "vercel-token",
    Boolean(process.env.VERCEL_TOKEN?.trim()),
    process.env.VERCEL_TOKEN ? "set → ops:collect / ops:prune-deployments" : "unset → CI secret veya .env.local",
  );
  flag(
    "manual-cron-secret",
    Boolean(process.env.MANUAL_CRON_SECRET?.trim()),
    process.env.MANUAL_CRON_SECRET
      ? "set → check:gds-ops /ops/growthdaily"
      : "unset → Worker secret; check:gds-ops skips ops API",
  );
  const base = contentPublicBaseUrl();
  flag(
    "content-public-base",
    Boolean(base),
    base ?? "unset → gundem:verify-r2 index skip; smoke R2 image pass skip",
  );
  const gsc = Boolean(
    process.env.GSC_SERVICE_ACCOUNT_JSON?.trim() || process.env.GSC_SERVICE_ACCOUNT_PATH?.trim(),
  );
  flag(
    "gsc-service-account",
    gsc,
    gsc ? "set → pnpm ops:gsc-sync live fetch" : "unset → ops:gsc-sync merges export or baseline snapshot",
  );

  let blogCount = 0;
  try {
    const out = execSync('find content/blog-queue -maxdepth 1 -name "*.json" | wc -l', {
      cwd: root,
      encoding: "utf8",
    });
    blogCount = Number.parseInt(out.trim(), 10) || 0;
  } catch {
    blogCount = 0;
  }
  const blogOk = blogCount >= BLOG_QUEUE_MIN;
  flag(
    "blog-queue-git",
    blogOk,
    blogOk
      ? `${blogCount} post(s) in content/blog-queue (GDS/R2 kanonik; git kuyruk bakım ≥${BLOG_QUEUE_MIN}, runway ≥${BLOG_QUEUE_RUNWAY})`
      : `${blogCount} post(s); hedef ≥${BLOG_QUEUE_MIN} (weekly-seo-blog workflow_dispatch)`,
  );

  try {
    const index = await probeGundemSitemapIndex();
    flag("gundem-sitemap-index", index.ok, index.detail);
  } catch (error) {
    flag("gundem-sitemap-index", false, error instanceof Error ? error.message : String(error));
  }

  const today = istanbulCalendarDay();
  const fixturesRaw = await readFile(resolve(root, "app/lib/gds-prod-fixtures.ts"), "utf8");
  const syncedDay = fixturesRaw.match(/Auto-synced from D1 \(([^)]+)\)/)?.[1];
  const fixturesFresh = syncedDay === today;
  flag(
    "gds-prod-fixtures",
    fixturesFresh,
    fixturesFresh
      ? `synced ${today} → ${fixturesRaw.match(/GDS_PROD_PUBLISHED_SLUG = "([^"]+)"/)?.[1] ?? "?"}`
      : `fixtures day ${syncedDay ?? "?"} ≠ ${today}; pnpm gds:sync-fixtures after cap publish`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
