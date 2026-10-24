import { execSync } from "node:child_process";
import { resolve } from "node:path";
import {
  GDS_PROD_CAP_DEFERRED_SLUG,
  GDS_PROD_PUBLISHED_SLUG,
} from "../../app/lib/gds-prod-fixtures";
import { istanbulCalendarDay } from "./istanbul-calendar-day";

const workerRoot = resolve(import.meta.dirname, "../../workers/content-publisher");

export type GdsD1Fixtures = {
  istanbulDay: string;
  publishedSlug: string | null;
  deferredSlug: string | null;
};

function d1Query<T>(sql: string): T[] {
  const out = execSync(
    `pnpm wrangler d1 execute content-meta --remote --command ${JSON.stringify(sql)} --json`,
    { cwd: workerRoot, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
  );
  const parsed = JSON.parse(out) as { results?: T[] }[];
  return parsed[0]?.results ?? [];
}

/** D1 yoksa (CI, wrangler auth) committed `gds-prod-fixtures.ts` ile devam. */
export function resolveGdsFixturesSafe(day = istanbulCalendarDay()): GdsD1Fixtures {
  try {
    return resolveGdsFixturesFromD1(day);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.log(`WARN gds-d1: remote D1 skipped (${detail.split("\n")[0]}); using gds-prod-fixtures.ts`);
    return {
      istanbulDay: day,
      publishedSlug: GDS_PROD_PUBLISHED_SLUG,
      deferredSlug: GDS_PROD_CAP_DEFERRED_SLUG,
    };
  }
}

/** Resolve today's cap winner / deferred slug from remote D1 (requires wrangler auth). */
export function resolveGdsFixturesFromD1(day = istanbulCalendarDay()): GdsD1Fixtures {
  const published = d1Query<{ slug: string }>(
    `SELECT slug FROM growthdaily_daily_publish WHERE istanbul_day = '${day}' ORDER BY reserved_at ASC LIMIT 1`,
  );
  const deferred = d1Query<{ slug: string }>(
    `SELECT slug FROM growthdaily_deferred WHERE istanbul_day = '${day}' AND reason = 'daily-publish-cap' ORDER BY deferred_at ASC LIMIT 1`,
  );
  return {
    istanbulDay: day,
    publishedSlug: published[0]?.slug ?? null,
    deferredSlug: deferred[0]?.slug ?? null,
  };
}
