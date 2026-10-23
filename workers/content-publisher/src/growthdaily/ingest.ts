import { estimateReadingMinutesFromHtml } from "@berktug/editorial-gates/blog/reading-html";
import { runGrowthDailyGates } from "@berktug/editorial-gates/blog/growthdaily-gates";
import type { ReadingLocale } from "@berktug/editorial-gates/blog/reading-html";
import { GrowthDailyClient } from "./client";
import {
  getGrowthDailyIngestState,
  recordGrowthDailyIngest,
  recordPublishedSlug,
  slugPublishedInChannel,
} from "./d1-sync";
import { sanitizeArticleHtml } from "./sanitize";
import { translateHtmlToLocale, WORKER_TRANSLATED_LOCALES } from "./translate";
import { isGdsApprovedForSitePublish } from "./gds-approval";
import {
  DAILY_CAP_REASON,
  isDailyCapReached,
  rankDailyCandidates,
  releaseDailySlot,
  reserveDailySlot,
} from "./daily-cap";
import type { GrowthDailyBlogRecord, GrowthDailyPost } from "./types";
import { mergeBlogIndex, putJson } from "../r2";
import { revalidateOrQueue } from "../revalidate";
import { submitIndexNow } from "../indexnow";

const GDS_LOCALES = ["en", "tr", "de"] as const;
const SITE_ORIGIN = "https://berktugberke.com";

async function isSlugBlocked(env: Env, slug: string): Promise<boolean> {
  const existing = await env.CONTENT_BUCKET.get(`blogs/${slug}.json`);
  if (existing) {
    const record = (await existing.json()) as { source?: string };
    if (record.source === "growthdaily") return false;
  }
  if (await slugPublishedInChannel(env, slug, "blog")) return true;
  try {
    const res = await fetch(`${SITE_ORIGIN}/blogs/${encodeURIComponent(slug)}`, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

/** Full ISO-8601 UTC datetime (schema.org / GSC); never a bare YYYY-MM-DD. */
function isoDate(iso: string | null | undefined): string {
  const raw = iso?.trim();
  if (raw) {
    const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T12:00:00.000Z` : raw);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

function keywordsFrom(post: GrowthDailyPost): string[] {
  const kw = post.seo?.keywords;
  if (kw?.length) return kw;
  return post.title
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3)
    .slice(0, 8);
}

function isPrimaryEnglish(post: GrowthDailyPost): boolean {
  const lang = (post.language ?? "en").toLowerCase();
  return lang === "en" && !post.sourcePostId;
}

async function putLocalePost(
  bucket: R2Bucket,
  slug: string,
  locale: string,
  record: GrowthDailyBlogRecord,
): Promise<void> {
  if (locale === "en") {
    await putJson(bucket, `blogs/${slug}.json`, record);
    return;
  }
  await putJson(bucket, `blogs/${locale}/${slug}.json`, record);
}

function revalidatePathsFor(slug: string, locales: readonly string[]): string[] {
  const paths = new Set<string>([
    "/blogs",
    `/blogs/${slug}`,
    "/blogs/rss.xml",
    "/blogs/feed.json",
    "/llms.txt",
    "/sitemap.xml",
  ]);
  for (const loc of locales) {
    if (loc === "en") continue;
    paths.add(`/${loc}/blogs`);
    paths.add(`/${loc}/blogs/${slug}`);
    paths.add(`/${loc}/blogs/rss.xml`);
  }
  return [...paths];
}

async function sendGateAlert(env: Env, slug: string, code: string, detail?: string): Promise<void> {
  if (!env.ALERT_EMAIL) return;
  try {
    await env.ALERT_EMAIL.send({
      from: "newsroom@berktugberke.com",
      to: "berktugates@gmail.com",
      subject: `[blog] GrowthDailySEO gate rejected: ${slug}`,
      content: [{ type: "text/plain", value: `code=${code}\ndetail=${detail ?? ""}\nslug=${slug}` }],
    });
  } catch (e) {
    console.error("growthdaily alert email failed", e);
  }
}

export type IngestResult =
  | { ok: true; slug: string; locales: string[]; skipped?: boolean; reason?: string }
  | { ok: false; code: string; detail?: string };

export async function ingestGrowthDailyPost(env: Env, slug: string): Promise<IngestResult> {
  const apiKey = env.GROWTHDAILY_API_KEY;
  const siteId = env.GROWTHDAILY_SITE_ID;
  if (!apiKey || !siteId) return { ok: false, code: "missing-config" };

  const client = new GrowthDailyClient(apiKey, siteId);
  const post = await client.getPost(slug);
  if (!post) return { ok: false, code: "post-not-found" };

  const updatedAt = post.updatedAt ?? post.publishedAt ?? new Date().toISOString();
  const prior = await getGrowthDailyIngestState(env, post.id);
  if (prior && prior.updatedAt === updatedAt) {
    return { ok: true, slug: prior.slug, locales: [], skipped: true };
  }

  if (!isPrimaryEnglish(post)) {
    return { ok: true, slug: post.slug, locales: [], skipped: true, reason: "translation-locale" };
  }

  if (!isGdsApprovedForSitePublish(post, { publishDrafts: env.GROWTHDAILY_PUBLISH_DRAFTS === "true" })) {
    console.log(`growthdaily: awaiting GDS approval slug=${post.slug} status=${post.status}`);
    return { ok: true, slug: post.slug, locales: [], skipped: true, reason: "awaiting-gds-approval" };
  }

  // A post already ingested once is an update (never consumes a new daily slot).
  const isUpdate = prior !== null;
  if (await isDailyCapReached(env, { postId: post.id, isUpdate })) {
    console.log(`growthdaily: daily publish cap reached, deferring slug=${post.slug}`);
    return { ok: true, slug: post.slug, locales: [], skipped: true, reason: DAILY_CAP_REASON };
  }

  const sanitizedEn = await sanitizeArticleHtml(post.contentHtml);
  const excerpt = post.excerpt ?? post.seo?.metaDescription ?? post.title;
  const description = post.seo?.metaDescription ?? excerpt;

  const slugTaken = await isSlugBlocked(env, post.slug);
  const gate = runGrowthDailyGates({
    title: post.title,
    excerpt,
    contentHtml: sanitizedEn,
    qualityBand: post.qualityBand,
    keywords: keywordsFrom(post),
    locale: "en",
    slug: post.slug,
    slugTaken,
  });
  if (!gate.ok) {
    await sendGateAlert(env, post.slug, gate.code, gate.detail);
    return { ok: false, code: gate.code, detail: gate.detail };
  }

  const publishedAt = isoDate(post.publishedAt ?? updatedAt);
  const readingMinutes = estimateReadingMinutesFromHtml(sanitizedEn, "en");

  const translations = await client.listPostsUpdatedAfter(
    new Date(Date.now() - 30 * 86400_000).toISOString(),
  );
  const related = translations.filter((p) => p.sourcePostId === post.id || p.id === post.id);

  const localeHtml: Record<string, string> = { en: sanitizedEn };
  const localeMeta: Record<string, { title: string; excerpt: string; description: string }> = {
    en: { title: post.title, excerpt, description },
  };

  for (const loc of ["tr", "de"] as const) {
    const trPost = related.find((p) => (p.language ?? "").toLowerCase() === loc);
    if (!trPost?.contentHtml) continue;
    localeHtml[loc] = await sanitizeArticleHtml(trPost.contentHtml);
    localeMeta[loc] = {
      title: trPost.title,
      excerpt: trPost.excerpt ?? trPost.seo?.metaDescription ?? trPost.title,
      description: trPost.seo?.metaDescription ?? trPost.excerpt ?? description,
    };
    await recordGrowthDailyIngest(env, {
      postId: trPost.id,
      slug: post.slug,
      updatedAt: trPost.updatedAt ?? updatedAt,
      language: loc,
    });
  }

  const gdsLocales = GDS_LOCALES.filter((loc) => loc !== "en" && localeHtml[loc]);
  let publishedLocales = ["en", ...gdsLocales];

  const buildEnRecord = (locales: readonly string[]): GrowthDailyBlogRecord => ({
    slug: post.slug,
    title: post.title,
    excerpt,
    description,
    publishedAt,
    dateModified: isoDate(updatedAt),
    readingMinutes,
    keywords: keywordsFrom(post),
    sections: [],
    contentHtml: sanitizedEn,
    faqJsonLd: post.faqJsonLd,
    source: "growthdaily",
    locales,
    growthDailyPostId: post.id,
  });

  async function publishLocales(locales: readonly string[]): Promise<void> {
    const uniqueLocales = [...new Set(locales)];
    const enRecord = buildEnRecord(uniqueLocales);
    await putLocalePost(env.CONTENT_BUCKET, post.slug, "en", enRecord);
    for (const loc of uniqueLocales) {
      if (loc === "en") continue;
      const meta = localeMeta[loc] ?? localeMeta.en!;
      const html = localeHtml[loc];
      if (!html) continue;
      const locRecord: GrowthDailyBlogRecord = {
        ...enRecord,
        title: meta.title,
        excerpt: meta.excerpt,
        description: meta.description,
        contentHtml: html,
        readingMinutes: estimateReadingMinutesFromHtml(html, loc as ReadingLocale),
      };
      await putLocalePost(env.CONTENT_BUCKET, post.slug, loc, locRecord);
    }
    await mergeBlogIndex(env.CONTENT_BUCKET, { ...enRecord, sections: [] });
    const paths = revalidatePathsFor(post.slug, uniqueLocales);
    await revalidateOrQueue(env, paths, ["blogs"]);
    const indexUrls = uniqueLocales.map((loc) =>
      loc === "en" ? `${SITE_ORIGIN}/blogs/${post.slug}` : `${SITE_ORIGIN}/${loc}/blogs/${post.slug}`,
    );
    await submitIndexNow(env, indexUrls);
  }

  // Atomic claim right before the first R2 write (webhook + cron may race).
  const slot = await reserveDailySlot(env, {
    postId: post.id,
    slug: post.slug,
    qualityBand: post.qualityBand,
    isUpdate,
  });
  if (!slot) {
    console.log(`growthdaily: daily publish cap reached (race), deferring slug=${post.slug}`);
    return { ok: true, slug: post.slug, locales: [], skipped: true, reason: DAILY_CAP_REASON };
  }
  try {
    await publishLocales(publishedLocales);
  } catch (e) {
    await releaseDailySlot(env, slot);
    throw e;
  }

  for (const loc of WORKER_TRANSLATED_LOCALES) {
    const translated = await translateHtmlToLocale(env, sanitizedEn, loc as ReadingLocale);
    if (!translated.ok) {
      console.log(`growthdaily: skip locale ${loc}`, translated.code);
      continue;
    }
    localeHtml[loc] = await sanitizeArticleHtml(translated.html);
    localeMeta[loc] = { title: post.title, excerpt, description };
    publishedLocales = [...publishedLocales, loc];
    await publishLocales(publishedLocales);
  }

  await recordGrowthDailyIngest(env, {
    postId: post.id,
    slug: post.slug,
    updatedAt,
    language: "en",
  });
  await recordPublishedSlug(env, post.slug, "growthdaily", updatedAt);

  return { ok: true, slug: post.slug, locales: [...new Set(publishedLocales)] };
}

export type ReconcileResult = {
  processed: number;
  /** New posts left for a later Istanbul day because the daily cap was reached. */
  deferredByCap: number;
};

export async function reconcileGrowthDaily(env: Env): Promise<ReconcileResult> {
  const apiKey = env.GROWTHDAILY_API_KEY;
  const siteId = env.GROWTHDAILY_SITE_ID;
  if (!apiKey || !siteId) return { processed: 0, deferredByCap: 0 };

  const { getGrowthDailySyncCursor, setGrowthDailySyncCursor } = await import("./d1-sync");
  const cursor = (await getGrowthDailySyncCursor(env)) ?? new Date(Date.now() - 7 * 86400_000).toISOString();
  const client = new GrowthDailyClient(apiKey, siteId);
  const posts = await client.listPostsUpdatedAfter(cursor);
  // Best first: premium > standard > review, then newest updatedAt. Cap is enforced per post in ingest.
  const ranked = rankDailyCandidates(posts.filter(isPrimaryEnglish), {
    publishDrafts: env.GROWTHDAILY_PUBLISH_DRAFTS === "true",
  });
  let processed = 0;
  let deferredByCap = 0;
  let maxUpdated = cursor;
  let earliestDeferred: string | null = null;
  for (const summary of ranked) {
    const updated = summary.updatedAt ?? summary.publishedAt;
    if (updated && updated > maxUpdated) maxUpdated = updated;
    const result = await ingestGrowthDailyPost(env, summary.slug);
    if (result.ok && !result.skipped) processed += 1;
    if (result.ok && result.reason === DAILY_CAP_REASON) {
      deferredByCap += 1;
      if (updated && (earliestDeferred === null || updated < earliestDeferred)) earliestDeferred = updated;
    }
  }
  // Do not advance the cursor past posts deferred by the cap, so tomorrow's run sees them again.
  let nextCursor = maxUpdated;
  if (earliestDeferred) {
    const held = new Date(Date.parse(earliestDeferred) - 1).toISOString();
    if (held < nextCursor) nextCursor = held;
    if (nextCursor < cursor) nextCursor = cursor;
  }
  await setGrowthDailySyncCursor(env, nextCursor);
  return { processed, deferredByCap };
}
