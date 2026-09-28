import { fetchFeedWithPolicy, type TrMediaFeedConfig } from "@berktug/editorial-gates/gundem/feed-ingest";
import { clusterFeedItems, clusterMeetsSyndicationRules } from "@berktug/editorial-gates/gundem/story-cluster";
import { loadFeedConfigDefaults } from "@berktug/editorial-gates/gundem/tr-media-rss";
import { runGundemPublishGates } from "@berktug/editorial-gates/publish/gates";
import type { GundemBriefing } from "@berktug/editorial-gates/gundem/types";
import {
  addDailyNewsUsage,
  createPublishJob,
  finishPublishJob,
  getDailyNewsUsage,
  getFeedCursor,
  loadActiveNewsSourceItems,
  markStoryPublished,
  recordFeedResult,
  recordReviewDraft,
  recordStoryEvidenceAndClaims,
  recordTrendPublish,
  storyByClusterKey,
  syncNewsSources,
  upsertNewsSourceItems,
  upsertNewsStory,
} from "./d1";
import {
  archiveGundemRevision,
  mergeGundemIndex,
  putJson,
  putReviewDraft,
  sha256Hex,
} from "./r2";
import { revalidateOrQueue } from "./revalidate";
import { submitIndexNow } from "./indexnow";
import {
  composeNewsDraftWithAi,
  ESTIMATED_NEURONS_PER_DRAFT,
} from "./news-draft";

const MAX_NEW_PER_DAY = 6;
const NEWS_AI_BUDGET = 8_000;

export function shouldRecordFeedResult(status: "ok" | "not-modified" | "skipped" | "failed"): boolean {
  return status !== "skipped";
}

async function loadFeedConfig(bucket: R2Bucket): Promise<TrMediaFeedConfig> {
  const obj = await bucket.get("meta/tr-media-rss-feeds.json");
  if (!obj) return loadFeedConfigDefaults();
  try {
    const config = (await obj.json()) as TrMediaFeedConfig;
    return config.allowHtmlArticleScrape === false ? config : loadFeedConfigDefaults();
  } catch {
    return loadFeedConfigDefaults();
  }
}

async function loadGundemIndex(bucket: R2Bucket): Promise<GundemBriefing[]> {
  const obj = await bucket.get("gundem/index.json");
  if (!obj) return [];
  try { return ((await obj.json()) as { posts?: GundemBriefing[] }).posts ?? []; }
  catch { return []; }
}

async function ingestFeeds(env: Env, config: TrMediaFeedConfig): Promise<void> {
  const feeds = config.feeds.filter((feed) => feed.enabled !== false && feed.rightsReviewedAt && feed.termsUrl).slice(0, 4);
  await syncNewsSources(env, feeds);
  const results = await Promise.all(feeds.map(async (feed) => {
    const cursor = await getFeedCursor(env, feed.id);
    const result = await fetchFeedWithPolicy(feed, cursor);
    if (shouldRecordFeedResult(result.status)) {
      await recordFeedResult(env, feed.id, {
        ok: result.status === "ok" || result.status === "not-modified",
        etag: result.etag,
        lastModified: result.lastModified,
      });
    }
    if (result.status === "failed") console.warn(`haber-cron: feed-failed source=${feed.id} reason=${result.error ?? "unknown"}`);
    return result;
  }));
  const items = results.flatMap((result) => result.items);
  await upsertNewsSourceItems(env, items, config.evidenceWindowHours ?? 36);
}

async function publishBriefing(
  env: Env,
  briefing: GundemBriefing,
  revisionKind: "publish" | "update" | "correction" | "retraction" = "publish",
): Promise<boolean> {
  const storyId = briefing.storyId ?? briefing.slug;
  const contentHash = await sha256Hex(briefing);
  const revisionId = `rev-${contentHash.slice(0, 24)}`;
  const idempotencyKey = `${storyId}:${revisionId}`;
  const created = await createPublishJob(env, { idempotencyKey, storyId, revisionId });
  if (!created) return false;
  try {
    const published: GundemBriefing = {
      ...briefing,
      status: revisionKind === "publish" ? "PUBLISHED" : revisionKind === "update" ? "UPDATED" : revisionKind === "correction" ? "CORRECTED" : "RETRACTED",
      revisions: [
        ...(briefing.revisions ?? []),
        { revisionId, kind: revisionKind, createdAt: briefing.dateModified },
      ],
    };
    const archive = await archiveGundemRevision(env.CONTENT_BUCKET, published, revisionId);
    await putJson(env.CONTENT_BUCKET, `gundem/${published.slug}.json`, published);
    await mergeGundemIndex(env.CONTENT_BUCKET, published);
    await markStoryPublished(env, published, revisionId, archive.objectKey, archive.contentHash, { ok: true }, revisionKind);
    await recordTrendPublish(env, published.trendQuery, published.slug, published.publishedAt);
    await addDailyNewsUsage(env, published.dateModified.slice(0, 10), revisionKind === "publish" ? { newPublished: 1 } : { updatesPublished: 1 });

    await revalidateOrQueue(
      env,
      ["/gundem", "/sitemap.xml", "/sitemap-news.xml", "/sitemap-gundem.xml", "/gundem/rss.xml", `/gundem/${published.slug}`],
      ["gundem"],
    );
    const host = env.HABERLER_HOST ?? "haberler.berktugberke.com";
    await submitIndexNow(env, [`https://${host}/`, `https://${host}/${published.slug}`]);
    await finishPublishJob(env, idempotencyKey, "complete");
    console.log(`haber-cron: published story=${storyId} slug=${published.slug}`);
    return true;
  } catch (error) {
    await finishPublishJob(env, idempotencyKey, "failed", error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export async function runHaberCron(env: Env): Promise<{ published: boolean; reason?: string }> {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const config = await loadFeedConfig(env.CONTENT_BUCKET);
  if (config.allowHtmlArticleScrape !== false) return { published: false, reason: "html-scrape-policy-invalid" };

  await ingestFeeds(env, config);
  const usage = await getDailyNewsUsage(env, today);
  if (usage.newPublished >= MAX_NEW_PER_DAY) return { published: false, reason: "daily-publish-cap" };
  if (usage.aiNeuronsEstimated + ESTIMATED_NEURONS_PER_DRAFT > NEWS_AI_BUDGET) {
    return { published: false, reason: "daily-ai-budget" };
  }

  const activeItems = await loadActiveNewsSourceItems(env);
  const clusters = clusterFeedItems(activeItems, config.evidenceWindowHours ?? 36);
  const index = await loadGundemIndex(env.CONTENT_BUCKET);
  let estimatedAiUsage = usage.aiNeuronsEstimated;
  for (const cluster of clusters) {
    if (!clusterMeetsSyndicationRules(cluster, config.minIndependentPublisherGroups ?? 2)) continue;
    if (index.some((post) => post.syndication?.clusterId === cluster.clusterId)) continue;
    if (await storyByClusterKey(env, cluster.clusterId)) continue;
    if (estimatedAiUsage + ESTIMATED_NEURONS_PER_DRAFT > NEWS_AI_BUDGET) {
      return { published: false, reason: "daily-ai-budget" };
    }

    let draft: GundemBriefing | null = null;
    try {
      draft = await composeNewsDraftWithAi(env, cluster, now);
      await addDailyNewsUsage(env, today, { aiNeuronsEstimated: ESTIMATED_NEURONS_PER_DRAFT });
      estimatedAiUsage += ESTIMATED_NEURONS_PER_DRAFT;
    } catch (error) {
      console.log("haber-cron: ai-failed", error instanceof Error ? error.message : error);
      return { published: false, reason: "ai-failed" };
    }
    if (!draft) continue;

    const gated = await runGundemPublishGates(draft, {
      referenceHeadlines: cluster.items.map((item) => item.title),
      referenceSnippets: cluster.items.map((item) => item.descriptionSnippet).filter((value): value is string => Boolean(value)),
      editorialSource: "headlines",
      evidenceItems: cluster.items,
    });
    if (!gated.ok) {
      console.log(`haber-cron: gate-fail ${gated.code} ${gated.detail ?? ""}`);
      continue;
    }

    await upsertNewsStory(env, {
      storyId: gated.briefing.storyId ?? gated.briefing.slug,
      clusterKey: cluster.clusterId,
      slug: gated.briefing.slug,
      category: gated.briefing.category ?? "diger",
      riskLevel: gated.briefing.riskLevel ?? "high",
      status: gated.briefing.status ?? "GATED",
    });
    await recordStoryEvidenceAndClaims(env, gated.briefing, cluster.items);

    const autoPublish = env.NEWS_AUTO_PUBLISH === "true" && env.PUBLICATION_LEGAL_READY === "true";
    if (!autoPublish || gated.briefing.status === "REVIEW_REQUIRED") {
      await putReviewDraft(env.CONTENT_BUCKET, gated.briefing);
      await recordReviewDraft(env, gated.briefing, cluster.items.map((item) => item.dedupKey));
      return { published: false, reason: autoPublish ? "review-required" : "shadow-mode" };
    }
    return { published: await publishBriefing(env, { ...gated.briefing, status: "AUTO_APPROVED" }) };
  }
  return { published: false, reason: "no-eligible-cluster" };
}

export { publishBriefing };
