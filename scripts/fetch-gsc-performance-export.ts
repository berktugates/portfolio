/**
 * Search Console Search Analytics → data/gsc-performance-export.json (gitignore).
 * Env: GSC_SERVICE_ACCOUNT_JSON (tam JSON) veya GSC_SERVICE_ACCOUNT_PATH; GSC_SITE_URL (varsayılan sc-domain:berktugberke.com).
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getGoogleAccessToken, parseServiceAccountJson } from "./lib/google-service-account";

const root = resolve(import.meta.dirname, "..");
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const DEFAULT_SITE = "sc-domain:berktugberke.com";

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function loadServiceAccount(): Promise<string | null> {
  const inline = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (inline?.trim()) return inline;
  const path = process.env.GSC_SERVICE_ACCOUNT_PATH;
  if (path) return await readFile(resolve(root, path), "utf8");
  return null;
}

async function main() {
  const raw = await loadServiceAccount();
  if (!raw) {
    console.log("GSC fetch skipped: GSC_SERVICE_ACCOUNT_JSON / GSC_SERVICE_ACCOUNT_PATH not set.");
    process.exit(0);
  }

  const site = process.env.GSC_SITE_URL ?? DEFAULT_SITE;
  const sa = parseServiceAccountJson(raw);
  const token = await getGoogleAccessToken(sa, SCOPE);

  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 28);

  const queryUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
  const res = await fetch(queryUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate: isoDate(start),
      endDate: isoDate(end),
      dimensions: ["query"],
      rowLimit: 250,
    }),
  });
  if (!res.ok) {
    throw new Error(`Search Analytics query failed: ${res.status} ${await res.text()}`);
  }
  const body = (await res.json()) as {
    rows?: { keys?: string[]; clicks?: number; impressions?: number; ctr?: number }[];
  };

  const queries =
    body.rows?.map((row) => ({
      query: row.keys?.[0] ?? "",
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
    })) ?? [];

  const totals = queries.reduce(
    (acc, q) => ({
      clicks: acc.clicks + (q.clicks ?? 0),
      impressions: acc.impressions + (q.impressions ?? 0),
    }),
    { clicks: 0, impressions: 0 },
  );

  const out = {
    exportedAt: isoDate(end),
    period: "28d",
    site,
    totals,
    queries,
  };

  const outPath = resolve(root, "data/gsc-performance-export.json");
  await writeFile(outPath, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`Wrote ${outPath} (${queries.length} queries, clicks=${totals.clicks})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
