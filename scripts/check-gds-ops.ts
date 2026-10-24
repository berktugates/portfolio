/**
 * GrowthDailySEO operasyon DoD — D1 cap, prod URL, IndexNow public key, ops API, optional reconcile.
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { gdsProdBlogUrl } from "../app/lib/gds-prod-fixtures";
import { resolveGdsFixturesFromD1 } from "./lib/gds-d1-fixtures";
import { istanbulCalendarDay } from "./lib/istanbul-calendar-day";
import { probeGdsDailyCapSurface } from "./lib/gds-prod-probes";

const root = resolve(import.meta.dirname, "..");
const WORKER_ORIGIN =
  process.env.CONTENT_PUBLISHER_ORIGIN ?? "https://berktug-content-publisher.berktugates.workers.dev";
const INDEXNOW_HEX = /^[0-9a-fA-F]{8,128}$/;

type IndexNowManifest = { key: string; keyFile: string; host: string };

async function checkIndexNowPublic(): Promise<string[]> {
  const errors: string[] = [];
  const manifest = JSON.parse(
    await readFile(resolve(root, "data/indexnow-public.json"), "utf8"),
  ) as IndexNowManifest;
  if (!INDEXNOW_HEX.test(manifest.key)) {
    errors.push(`indexnow-key-format: key must be 8–128 hex, got ${manifest.key}`);
  }
  const publicPath = resolve(root, "public", manifest.keyFile);
  const body = (await readFile(publicPath, "utf8")).trim();
  if (body !== manifest.key) {
    errors.push(`indexnow-key-file: ${manifest.keyFile} body mismatch`);
  }
  const url = `https://${manifest.host}/${manifest.keyFile}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    errors.push(`indexnow-key-prod: ${url} → HTTP ${res.status}`);
  } else {
    const remote = (await res.text()).trim();
    if (remote !== manifest.key) errors.push(`indexnow-key-prod: ${url} body mismatch`);
  }
  const oldUrl = `https://${manifest.host}/bberke2026indexnowkey.txt`;
  const oldRes = await fetch(oldUrl, { cache: "no-store" });
  if (oldRes.ok) {
    errors.push(`indexnow-legacy: remove or redirect ${oldUrl} (invalid non-hex key confused GDS panel)`);
  }
  return errors;
}

async function checkOpsApi(secret: string): Promise<string[]> {
  const errors: string[] = [];
  const res = await fetch(`${WORKER_ORIGIN}/ops/growthdaily`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: "no-store",
  });
  if (!res.ok) {
    errors.push(`gds-ops-api: HTTP ${res.status}`);
    return errors;
  }
  const body = (await res.json()) as {
    istanbulDay: string;
    cap: number;
    countToday: number;
    publishedToday: { slug: string }[];
  };
  const day = istanbulCalendarDay();
  if (body.istanbulDay !== day) {
    errors.push(`gds-ops-api: istanbulDay ${body.istanbulDay} !== ${day}`);
  }
  if (body.countToday > body.cap) {
    errors.push(`gds-ops-api: countToday ${body.countToday} > cap ${body.cap}`);
  }
  if (body.publishedToday.length > 0) {
    const slug = body.publishedToday[0]!.slug;
    const blog = await fetch(gdsProdBlogUrl(slug), { cache: "no-store" });
    if (blog.status !== 200) errors.push(`gds-ops-published: ${slug} → HTTP ${blog.status}`);
  }
  console.log(
    `OK gds-ops-api: day=${body.istanbulDay} cap=${body.cap} used=${body.countToday} published=${body.publishedToday.map((p) => p.slug).join(",") || "—"}`,
  );
  return errors;
}

async function maybeReconcile(secret: string): Promise<void> {
  if (process.env.GDS_RECONCILE !== "1") return;
  const res = await fetch(`${WORKER_ORIGIN}/cron/growthdaily`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}` },
  });
  if (!res.ok) throw new Error(`reconcile HTTP ${res.status}`);
  const body = (await res.json()) as { processed: number; deferredByCap: number };
  console.log(`OK gds-reconcile: processed=${body.processed} deferredByCap=${body.deferredByCap}`);
}

async function main() {
  let errors = 0;

  for (const msg of await checkIndexNowPublic()) {
    console.log(`FAIL ${msg}`);
    errors += 1;
  }
  if (errors === 0) console.log("OK indexnow-public: hex key file on prod");

  try {
    const fixtures = resolveGdsFixturesFromD1();
    console.log(
      `OK gds-d1: day=${fixtures.istanbulDay} published=${fixtures.publishedSlug ?? "—"} deferred=${fixtures.deferredSlug ?? "—"}`,
    );
    if (!fixtures.publishedSlug) {
      console.log("WARN gds-d1: no publish row today (cap unused or before first publish)");
    }
  } catch (error) {
    console.log(`FAIL gds-d1: ${error instanceof Error ? error.message : String(error)}`);
    errors += 1;
  }

  const probes = await probeGdsDailyCapSurface();
  for (const p of probes) {
    if (p.ok) console.log(`OK ${p.name}: ${p.detail}`);
    else {
      console.log(`FAIL ${p.name}: ${p.detail}`);
      errors += 1;
    }
  }

  const secret = process.env.MANUAL_CRON_SECRET?.trim();
  if (secret) {
    for (const msg of await checkOpsApi(secret)) {
      console.log(`FAIL ${msg}`);
      errors += 1;
    }
    await maybeReconcile(secret);
  } else {
    console.log("WARN manual-cron-secret: MANUAL_CRON_SECRET unset; skip /ops/growthdaily");
  }

  console.log(`\nGDS ops check: ${errors} error(s).`);
  if (errors > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
