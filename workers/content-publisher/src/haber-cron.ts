import { fetchFeedWithPolicy, type TrMediaFeedConfig } from "@berktug/editorial-gates/gundem/feed-ingest";
import {
  HABERLER_LANES,
  categoryToLane,
} from "@berktug/editorial-gates/gundem/haberler-lanes";
import { clusterFeedItems, clusterMeetsSyndicationRules, type FeedStoryCluster } from "@berktug/editorial-gates/gundem/story-cluster";
import { loadFeedConfigDefaults } from "@berktug/editorial-gates/gundem/tr-media-rss";
import { runGundemPublishGates } from "@berktug/editorial-gates/publish/gates";
import type { GundemBriefing } from "@berktug/editorial-gates/gundem/types";
import {
  addDailyNewsUsage,
  countLanePublishesForDay,
  createPublishJob,
  finishPublishJob,
  getDailyNewsUsage,
  getFeedCursor,
  getPublishedLanesForDay,
  loadActiveNewsSourceItems,
  markStoryPublished,
  recordFeedResult,
  recordLanePublish,
  recordReviewDraft,
  recordStoryEvidenceAndClaims,
  recordTrendPublish,
  storyByClusterKey,
  syncNewsSources,
  upsertNewsSourceItems,
  upsertNewsStory,
} from "./d1";
import { istanbulCalendarDay } from "./growthdaily/daily-cap";
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

const MAX_NEW_PER_DAY = HABERLER_LANES.length;
const NEWS_AI_BUDGET = 8_000;

export function shouldRecordFeedResult(status: "ok" | "not-modified" | "skipped" | "failed"): boolean {
  return status !== "skipped";
}

function clusterScore(cluster: FeedStoryCluster): number {
  return (
    cluster.independentPublisherGroupIds.length * 100 +
    cluster.items.length * 15 +
    cluster.distinctFeedIds.length * 10
  );
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
  try {
    return ((await obj.json()) as { posts?: GundemBriefing[] }).posts ?? [];
  } catch {
    return [];
  }
}

async function ingestFeeds(env: Env, config: TrMediaFeedConfig): Promise<void> {
  const feeds = config.feeds.filter(
    (feed) => feed.enabled !== false && feed.rightsReviewedAt && feed.termsUrl,
  );
  await syncNewsSources(env, feeds);
  const results = await Promise.all(
    feeds.map(async (feed) => {
      const cursor = await getFeedCursor(env, feed.id);
      const result = await fetchFeedWithPolicy(feed, cursor);
      if (shouldRecordFeedResult(result.status)) {
        await recordFeedResult(env, feed.id, {
          ok: result.status === "ok" || result.status === "not-modified",
          etag: result.etag,
          lastModified: result.lastModified,
        });
      }
      if (result.status === "failed") {
        console.warn(`haber-cron: feed-failed source=${feed.id} reason=${result.error ?? "unknown"}`);
      }
      return result;
    }),
  );
  const items = results.flatMap((result) => result.items);
  await upsertNewsSourceItems(env, items, config.evidenceWindowHours ?? 36);
}

async function publishBriefing(
  env: Env,
  briefing: GundemBriefing,
  istanbulDay: string,
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
      status:
        revisionKind === "publish"
          ? "PUBLISHED"
          : revisionKind === "update"
            ? "UPDATED"
            : revisionKind === "correction"
              ? "CORRECTED"
              : "RETRACTED",
      revisions: [
        ...(briefing.revisions ?? []),
        { revisionId, kind: revisionKind, createdAt: briefing.dateModified },
      ],
    };
    const archive = await archiveGundemRevision(env.CONTENT_BUCKET, published, revisionId);
    await putJson(env.CONTENT_BUCKET, `gundem/${published.slug}.json`, published);
    await mergeGundemIndex(env.CONTENT_BUCKET, published);
    await markStoryPublished(env, published, revisionId, archive.objectKey, archive.contentHash, { ok: true }, revisionKind);
    if (published.trendQuery?.trim()) {
      await recordTrendPublish(env, published.trendQuery, published.slug, published.publishedAt);
    }
    await addDailyNewsUsage(env, istanbulDay, revisionKind === "publish" ? { newPublished: 1 } : { updatesPublished: 1 });
    if (revisionKind === "publish") {
      const lane = categoryToLane(published.category);
      await recordLanePublish(env, istanbulDay, lane, published.slug, published.publishedAt);
    }

    await revalidateOrQueue(
      env,
      [
        "/gundem",
        "/sitemap.xml",
        "/sitemap-news.xml",
        "/sitemap-gundem.xml",
        "/gundem/rss.xml",
        `/gundem/${published.slug}`,
      ],
      ["gundem"],
    );
    const host = env.HABERLER_HOST ?? "haberler.berktugberke.com";
    await submitIndexNow(env, [`https://${host}/`, `https://${host}/${published.slug}`]);
    await finishPublishJob(env, idempotencyKey, "complete");
    console.log(`haber-cron: published story=${storyId} slug=${published.slug} lane=${categoryToLane(published.category)}`);
    return true;
  } catch (error) {
    await finishPublishJob(env, idempotencyKey, "failed", error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export async function runHaberCron(env: Env): Promise<{ published: boolean; reason?: string; count?: number }> {
  const now = new Date();
  const istanbulDay = istanbulCalendarDay(now);
  const config = await loadFeedConfig(env.CONTENT_BUCKET);
  if (config.allowHtmlArticleScrape !== false) return { published: false, reason: "html-scrape-policy-invalid" };

  await ingestFeeds(env, config);
  const usage = await getDailyNewsUsage(env, istanbulDay);
  if (usage.newPublished >= MAX_NEW_PER_DAY) return { published: false, reason: "daily-publish-cap" };
  if (usage.aiNeuronsEstimated + ESTIMATED_NEURONS_PER_DRAFT > NEWS_AI_BUDGET) {
    return { published: false, reason: "daily-ai-budget" };
  }

  const filledLanes = await getPublishedLanesForDay(env, istanbulDay);
  if (filledLanes.size >= HABERLER_LANES.length) {
    return { published: false, reason: "all-lanes-filled" };
  }

  const activeItems = await loadActiveNewsSourceItems(env);
  const clusters = clusterFeedItems(activeItems, config.evidenceWindowHours ?? 36).sort(
    (a, b) => clusterScore(b) - clusterScore(a),
  );
  const index = await loadGundemIndex(env.CONTENT_BUCKET);
  const usedImageSrc = new Set(
    index
      .filter((post) => post.publishedAt.startsWith(istanbulDay))
      .map((post) => post.image?.src)
      .filter((src): src is string => Boolean(src)),
  );

  let estimatedAiUsage = usage.aiNeuronsEstimated;
  let publishedCount = 0;

  for (const cluster of clusters) {
    if (filledLanes.size >= HABERLER_LANES.length) break;
    if (usage.newPublished + publishedCount >= MAX_NEW_PER_DAY) break;
    if (estimatedAiUsage + ESTIMATED_NEURONS_PER_DRAFT > NEWS_AI_BUDGET) break;

    if (!clusterMeetsSyndicationRules(cluster, config.minIndependentPublisherGroups ?? 2)) continue;
    if (index.some((post) => post.syndication?.clusterId === cluster.clusterId)) continue;
    if (await storyByClusterKey(env, cluster.clusterId)) continue;

    let draft: GundemBriefing | null = null;
    try {
      draft = await composeNewsDraftWithAi(env, cluster, now, { usedImageSrc });
      await addDailyNewsUsage(env, istanbulDay, { aiNeuronsEstimated: ESTIMATED_NEURONS_PER_DRAFT });
      estimatedAiUsage += ESTIMATED_NEURONS_PER_DRAFT;
    } catch (error) {
      console.log("haber-cron: ai-failed", error instanceof Error ? error.message : error);
      continue;
    }
    if (!draft) continue;

    const lane = categoryToLane(draft.category);
    if (filledLanes.has(lane)) continue;

    const gated = await runGundemPublishGates(draft, {
      referenceHeadlines: cluster.items.map((item) => item.title),
      referenceSnippets: cluster.items
        .map((item) => item.descriptionSnippet)
        .filter((value): value is string => Boolean(value)),
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
      continue;
    }

    const ok = await publishBriefing(env, { ...gated.briefing, status: "AUTO_APPROVED" }, istanbulDay);
    if (ok) {
      publishedCount += 1;
      filledLanes.add(lane);
      if (gated.briefing.image?.src) usedImageSrc.add(gated.briefing.image.src);
    }
  }

  if (publishedCount > 0) {
    return { published: true, count: publishedCount };
  }
  const laneCount = await countLanePublishesForDay(env, istanbulDay);
  if (laneCount >= HABERLER_LANES.length) return { published: false, reason: "all-lanes-filled" };
  return { published: false, reason: "no-eligible-cluster" };
}

export { publishBriefing };
