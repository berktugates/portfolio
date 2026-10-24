/** Worker GDS reconcile — webhook yedek (GitHub schedule veya yerel). */
import { postGdsReconcile } from "./lib/gds-ops-snapshot";

async function main() {
  const secret = process.env.MANUAL_CRON_SECRET?.trim();
  if (!secret) {
    console.error("FAIL gds-reconcile: MANUAL_CRON_SECRET required");
    process.exit(1);
  }
  const body = await postGdsReconcile(secret);
  console.log(`OK gds-reconcile: processed=${body.processed} deferredByCap=${body.deferredByCap}`);
}

main().catch((err) => {
  console.error(`FAIL gds-reconcile: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
