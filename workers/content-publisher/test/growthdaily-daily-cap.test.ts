import assert from "node:assert/strict";
import test from "node:test";
import {
  DAILY_CAP_REASON,
  istanbulCalendarDay,
  parseDailyPublishCap,
  rankDailyCandidates,
  releaseDailySlot,
  reserveDailySlot,
  selectDailyBatch,
} from "../src/growthdaily/daily-cap";
import { ingestGrowthDailyPost } from "../src/growthdaily/ingest";

type Row = { day: string; postId: string };

/** Minimal in-memory D1 covering only the statements the cap/ingest-prelude uses. */
function fakeEnv(opts: { cap?: string; ingested?: Record<string, string> } = {}) {
  const rows: Row[] = [];
  const ingested = opts.ingested ?? {};
  const bucketWrites: string[] = [];
  const env = {
    GROWTHDAILY_API_KEY: "k",
    GROWTHDAILY_SITE_ID: "s",
    GROWTHDAILY_DAILY_PUBLISH_CAP: opts.cap,
    CONTENT_BUCKET: {
      get: async () => null,
      put: async (key: string) => {
        bucketWrites.push(key);
      },
    },
    META: {
      prepare(sql: string) {
        let args: unknown[] = [];
        const stmt = {
          bind(...a: unknown[]) {
            args = a;
            return stmt;
          },
          async first() {
            if (sql.includes("FROM growthdaily_ingest")) {
              const u = ingested[args[0] as string];
              return u ? { updated_at: u, slug: "s" } : null;
            }
            if (sql.includes("COUNT(*)")) return { n: rows.filter((r) => r.day === args[0]).length };
            if (sql.includes("FROM growthdaily_daily_publish")) {
              return rows.some((r) => r.day === args[0] && r.postId === args[1]) ? { x: 1 } : null;
            }
            return null;
          },
          async run() {
            if (sql.startsWith("INSERT INTO growthdaily_daily_publish")) {
              const [day, postId, , , , day2, cap] = args as [string, string, string, string, string, string, number];
              if (rows.filter((r) => r.day === day2).length < cap) {
                rows.push({ day, postId });
                return { meta: { changes: 1 } };
              }
              return { meta: { changes: 0 } };
            }
            if (sql.startsWith("DELETE FROM growthdaily_daily_publish")) {
              const i = rows.findIndex((r) => r.day === args[0] && r.postId === args[1]);
              if (i >= 0) rows.splice(i, 1);
            }
            return { meta: { changes: 0 } };
          },
        };
        return stmt;
      },
    },
  } as unknown as Env;
  return { env, rows, bucketWrites };
}

test("parseDailyPublishCap defaults to 1 and honours 0/2", () => {
  assert.equal(parseDailyPublishCap(undefined), 1);
  assert.equal(parseDailyPublishCap(""), 1);
  assert.equal(parseDailyPublishCap("abc"), 1);
  assert.equal(parseDailyPublishCap("-3"), 1);
  assert.equal(parseDailyPublishCap("0"), 0);
  assert.equal(parseDailyPublishCap("2"), 2);
});

test("istanbulCalendarDay rolls over at 21:00 UTC (UTC+3)", () => {
  assert.equal(istanbulCalendarDay(new Date("2026-10-23T20:59:00Z")), "2026-10-23");
  assert.equal(istanbulCalendarDay(new Date("2026-10-23T21:00:00Z")), "2026-10-24");
  assert.equal(istanbulCalendarDay(new Date("2026-10-24T04:15:00Z")), "2026-10-24");
});

test("rankDailyCandidates: premium > standard > review, tie => newest updatedAt", () => {
  const base = { publishedAt: null, status: "published" as const };
  const ranked = rankDailyCandidates([
    { ...base, slug: "review-new", qualityBand: "review" as const, updatedAt: "2026-10-23T10:00:00Z" },
    { ...base, slug: "std-old", qualityBand: "standard" as const, updatedAt: "2026-10-23T06:00:00Z" },
    { ...base, slug: "std-new", qualityBand: "standard" as const, updatedAt: "2026-10-23T09:00:00Z" },
    { ...base, slug: "prem-old", qualityBand: "premium" as const, updatedAt: "2026-10-22T01:00:00Z" },
  ]);
  assert.deepEqual(
    ranked.map((p) => p.slug),
    ["prem-old", "std-new", "std-old", "review-new"],
  );
});

test("rankDailyCandidates: drafts rank after approved posts regardless of quality", () => {
  const ranked = rankDailyCandidates([
    { slug: "draft-prem", qualityBand: "premium" as const, updatedAt: "2026-10-23T10:00:00Z", publishedAt: null, status: "draft" as const },
    { slug: "pub-review", qualityBand: "review" as const, updatedAt: "2026-10-23T01:00:00Z", publishedAt: null, status: "published" as const },
  ]);
  assert.equal(ranked[0]!.slug, "pub-review");
});

test("selectDailyBatch respects cap 0 / 1 / 2", () => {
  const posts = ["a", "b", "c"].map((slug, i) => ({
    slug,
    qualityBand: "standard" as const,
    updatedAt: `2026-10-23T0${i}:00:00Z`,
    publishedAt: null,
    status: "published" as const,
  }));
  assert.equal(selectDailyBatch(posts, 0).length, 0);
  assert.deepEqual(selectDailyBatch(posts, 1).map((p) => p.slug), ["c"]);
  assert.deepEqual(selectDailyBatch(posts, 2).map((p) => p.slug), ["c", "b"]);
});

test("reserveDailySlot: cap 1 allows first post, rejects second same day", async () => {
  const { env, rows } = fakeEnv({ cap: "1" });
  const now = new Date("2026-10-23T08:00:00Z");
  const first = await reserveDailySlot(env, { postId: "p1", slug: "one", qualityBand: "premium", isUpdate: false, now });
  assert.ok(first?.counted);
  const second = await reserveDailySlot(env, { postId: "p2", slug: "two", qualityBand: "standard", isUpdate: false, now });
  assert.equal(second, null);
  assert.equal(rows.length, 1);
});

test("reserveDailySlot: next Istanbul day gets a fresh quota", async () => {
  const { env } = fakeEnv({ cap: "1" });
  await reserveDailySlot(env, { postId: "p1", slug: "one", qualityBand: null, isUpdate: false, now: new Date("2026-10-23T08:00:00Z") });
  const next = await reserveDailySlot(env, { postId: "p2", slug: "two", qualityBand: null, isUpdate: false, now: new Date("2026-10-23T21:30:00Z") });
  assert.ok(next?.counted);
});

test("reserveDailySlot: cap 2 allows two, rejects third; cap 0 rejects all", async () => {
  const two = fakeEnv({ cap: "2" });
  const now = new Date("2026-10-23T08:00:00Z");
  assert.ok(await reserveDailySlot(two.env, { postId: "a", slug: "a", qualityBand: null, isUpdate: false, now }));
  assert.ok(await reserveDailySlot(two.env, { postId: "b", slug: "b", qualityBand: null, isUpdate: false, now }));
  assert.equal(await reserveDailySlot(two.env, { postId: "c", slug: "c", qualityBand: null, isUpdate: false, now }), null);
  const zero = fakeEnv({ cap: "0" });
  assert.equal(await reserveDailySlot(zero.env, { postId: "a", slug: "a", qualityBand: null, isUpdate: false, now }), null);
});

test("reserveDailySlot: updates and already-counted posts are exempt", async () => {
  const { env, rows } = fakeEnv({ cap: "1" });
  const now = new Date("2026-10-23T08:00:00Z");
  await reserveDailySlot(env, { postId: "p1", slug: "one", qualityBand: null, isUpdate: false, now });
  const again = await reserveDailySlot(env, { postId: "p1", slug: "one", qualityBand: null, isUpdate: false, now });
  assert.equal(again?.counted, false);
  const update = await reserveDailySlot(env, { postId: "old", slug: "old", qualityBand: null, isUpdate: true, now });
  assert.equal(update?.counted, false);
  assert.equal(rows.length, 1);
});

test("releaseDailySlot frees the slot after a failed publish", async () => {
  const { env, rows } = fakeEnv({ cap: "1" });
  const now = new Date("2026-10-23T08:00:00Z");
  const slot = await reserveDailySlot(env, { postId: "p1", slug: "one", qualityBand: null, isUpdate: false, now });
  await releaseDailySlot(env, slot!);
  assert.equal(rows.length, 0);
});

test("ingestGrowthDailyPost skips with daily-publish-cap before any R2 write", async () => {
  const { env, rows, bucketWrites } = fakeEnv({ cap: "1" });
  rows.push({ day: istanbulCalendarDay(), postId: "already-published-today" });
  const post = {
    id: "new-post",
    slug: "new-post",
    title: "New post",
    excerpt: "x",
    contentHtml: "<p>hi</p>",
    status: "published",
    publishedAt: null,
    updatedAt: "2026-10-23T09:00:00Z",
    readingTimeMinutes: null,
    qualityBand: "premium",
    reviewStatus: null,
    language: "en",
    sourcePostId: null,
  };
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response(JSON.stringify(post), { status: 200 })) as typeof fetch;
  try {
    const result = await ingestGrowthDailyPost(env, "new-post");
    assert.deepEqual(result, { ok: true, slug: "new-post", locales: [], skipped: true, reason: DAILY_CAP_REASON });
    assert.equal(bucketWrites.length, 0);
    assert.equal(rows.length, 1);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("ingestGrowthDailyPost: update of an already ingested post is not blocked by cap", async () => {
  const { env, rows } = fakeEnv({ cap: "1", ingested: { "old-post": "2026-10-20T00:00:00Z" } });
  rows.push({ day: istanbulCalendarDay(), postId: "someone-else" });
  const post = {
    id: "old-post",
    slug: "old-post",
    title: "Old",
    excerpt: "x",
    contentHtml: "<p>hi</p>",
    status: "draft",
    publishedAt: null,
    updatedAt: "2026-10-23T09:00:00Z",
    readingTimeMinutes: null,
    qualityBand: "premium",
    reviewStatus: null,
    language: "en",
    sourcePostId: null,
  };
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response(JSON.stringify(post), { status: 200 })) as typeof fetch;
  try {
    const result = await ingestGrowthDailyPost(env, "old-post");
    // Draft => stops at approval gate, proving the cap pre-check did not intercept an update.
    assert.deepEqual(result, { ok: true, slug: "old-post", locales: [], skipped: true, reason: "awaiting-gds-approval" });
  } finally {
    globalThis.fetch = realFetch;
  }
});
