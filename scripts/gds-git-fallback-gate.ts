/**
 * CI: GDS kanonik yayın varsa git kuyruk workflow'unu atla.
 * Exit 0 → git publish devam; exit 2 → skip (success); exit 1 → hata.
 */
import { fetchGdsOpsSnapshot, gdsPublishedToday } from "./lib/gds-ops-snapshot";

async function main() {
  const force = process.argv.includes("--force");
  if (force) {
    console.log("OK git-fallback-gate: forced (workflow_dispatch)");
    process.exit(0);
  }

  const secret = process.env.MANUAL_CRON_SECRET?.trim();
  if (!secret) {
    console.log("WARN git-fallback-gate: MANUAL_CRON_SECRET yok; güvenli mod → git atlanıyor");
    process.exit(2);
  }

  const snap = await fetchGdsOpsSnapshot(secret);
  if (gdsPublishedToday(snap)) {
    console.log(
      `SKIP git-fallback-gate: GDS bugün yayınladı (count=${snap.countToday}, slugs=${snap.publishedToday.map((p) => p.slug).join(",") || "—"})`,
    );
    process.exit(2);
  }

  console.log(`OK git-fallback-gate: GDS bugün boş (count=${snap.countToday}) → git kuyruk fallback`);
  process.exit(0);
}

main().catch((err) => {
  console.error(`FAIL git-fallback-gate: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
