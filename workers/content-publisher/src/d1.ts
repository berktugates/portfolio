export async function trendAlreadyPublished(env: Env, trendQuery: string): Promise<boolean> {
  const row = await env.META.prepare("SELECT 1 FROM trend_dedup WHERE trend_query = ? LIMIT 1")
    .bind(trendQuery.toLocaleLowerCase("tr").trim())
    .first();
  return row !== null;
}

export async function recordTrendPublish(env: Env, trendQuery: string, slug: string, at: string): Promise<void> {
  await env.META.prepare(
    "INSERT OR REPLACE INTO trend_dedup (trend_query, slug, published_at) VALUES (?, ?, ?)",
  )
    .bind(trendQuery.toLocaleLowerCase("tr").trim(), slug, at)
    .run();
  await env.META.prepare(
    "INSERT OR REPLACE INTO published_slugs (slug, channel, published_at) VALUES (?, ?, ?)",
  )
    .bind(slug, "gundem", at)
    .run();
}

export async function blogSlugPublished(env: Env, slug: string): Promise<boolean> {
  const row = await env.META.prepare("SELECT 1 FROM published_slugs WHERE slug = ? LIMIT 1")
    .bind(slug)
    .first();
  return row !== null;
}

export async function recordBlogPublish(env: Env, slug: string, at: string): Promise<void> {
  await env.META.prepare(
    "INSERT OR REPLACE INTO published_slugs (slug, channel, published_at) VALUES (?, ?, ?)",
  )
    .bind(slug, "blog", at)
    .run();
}

export async function nextBlogTopic(
  env: Env,
): Promise<{ id: number; slug_hint: string; prompt: string } | null> {
  const row = await env.META.prepare(
    "SELECT id, slug_hint, prompt FROM blog_topics WHERE published_at IS NULL ORDER BY id ASC LIMIT 1",
  ).first<{ id: number; slug_hint: string; prompt: string }>();
  return row ?? null;
}

export async function markBlogTopicPublished(env: Env, id: number, at: string): Promise<void> {
  await env.META.prepare("UPDATE blog_topics SET published_at = ? WHERE id = ?").bind(at, id).run();
}

export async function seedBlogTopicsIfEmpty(
  env: Env,
  topics: { slugHint: string; prompt: string }[],
): Promise<void> {
  const count = await env.META.prepare("SELECT COUNT(*) AS c FROM blog_topics").first<{ c: number }>();
  if ((count?.c ?? 0) > 0) return;
  for (const t of topics) {
    await env.META.prepare(
      "INSERT OR IGNORE INTO blog_topics (slug_hint, prompt, published_at) VALUES (?, ?, NULL)",
    )
      .bind(t.slugHint, t.prompt)
      .run();
  }
}
import type {
  FeedCursor,
  TrMediaFeedItem,
  TrMediaRssFeed,
} from "@berktug/editorial-gates/gundem/feed-ingest";
import type {
  GundemBriefing,
  NewsRiskLevel,
  NewsStoryStatus,
} from "@berktug/editorial-gates/gundem/types";

function isoHoursFrom(now: Date, hours: number): string {
  return new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
}

export async function syncNewsSources(env: Env, feeds: readonly TrMediaRssFeed[]): Promise<void> {
  if (!feeds.length) return;
  await env.META.batch(feeds.map((feed) => env.META.prepare(
    `INSERT INTO news_sources
      (source_id, label, publisher_group_id, source_type, feed_url, terms_url, rights_reviewed_at, trust_tier, enabled)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(source_id) DO UPDATE SET
       label=excluded.label,
       publisher_group_id=excluded.publisher_group_id,
       source_type=excluded.source_type,
       feed_url=excluded.feed_url,
       terms_url=excluded.terms_url,
       rights_reviewed_at=excluded.rights_reviewed_at,
       trust_tier=excluded.trust_tier,
       enabled=excluded.enabled`,
  ).bind(
    feed.id,
    feed.label ?? feed.id,
    feed.publisherGroupId ?? feed.id,
    feed.sourceType ?? (feed.tier === "official" ? "official" : "media"),
    feed.url,
    feed.termsUrl ?? null,
    feed.rightsReviewedAt ?? null,
    feed.trustTier ?? 1,
    feed.enabled === false ? 0 : 1,
  )));
}

export async function getFeedCursor(env: Env, sourceId: string): Promise<FeedCursor> {
  const row = await env.META.prepare(
    "SELECT etag, last_modified, consecutive_failures, circuit_open_until FROM news_sources WHERE source_id = ?",
  ).bind(sourceId).first<{
    etag: string | null;
    last_modified: string | null;
    consecutive_failures: number;
    circuit_open_until: string | null;
  }>();
  return {
    etag: row?.etag ?? undefined,
    lastModified: row?.last_modified ?? undefined,
    consecutiveFailures: row?.consecutive_failures ?? 0,
    circuitOpenUntil: row?.circuit_open_until ?? undefined,
  };
}

export async function recordFeedResult(
  env: Env,
  sourceId: string,
  result: { ok: boolean; etag?: string; lastModified?: string },
): Promise<void> {
  const now = new Date();
  if (result.ok) {
    await env.META.prepare(
      `UPDATE news_sources SET etag=COALESCE(?, etag), last_modified=COALESCE(?, last_modified),
       consecutive_failures=0, circuit_open_until=NULL, last_polled_at=? WHERE source_id=?`,
    ).bind(result.etag ?? null, result.lastModified ?? null, now.toISOString(), sourceId).run();
    return;
  }
  await env.META.prepare(
    `UPDATE news_sources SET
       consecutive_failures=consecutive_failures+1,
       circuit_open_until=CASE WHEN consecutive_failures+1 >= 3 THEN ? ELSE circuit_open_until END,
       last_polled_at=? WHERE source_id=?`,
  ).bind(isoHoursFrom(now, 1), now.toISOString(), sourceId).run();
}

export async function upsertNewsSourceItems(
  env: Env,
  items: readonly TrMediaFeedItem[],
  evidenceWindowHours = 36,
): Promise<void> {
  if (!items.length) return;
  const now = new Date();
  const nowIso = now.toISOString();
  const expiresAt = isoHoursFrom(now, evidenceWindowHours);
  await env.META.batch(items.map((item) => env.META.prepare(
    `INSERT INTO news_source_items
      (item_id, source_id, publisher_group_id, canonical_url, title, description_snippet,
       published_at, content_hash, first_seen_at, last_seen_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(item_id) DO UPDATE SET last_seen_at=excluded.last_seen_at, expires_at=excluded.expires_at`,
  ).bind(
    item.dedupKey,
    item.feedId,
    item.publisherGroupId,
    item.link ?? null,
    item.title,
    item.descriptionSnippet ?? null,
    item.pubDate ?? null,
    item.dedupKey,
    nowIso,
    nowIso,
    expiresAt,
  )));
}

export async function loadActiveNewsSourceItems(env: Env, limit = 300): Promise<TrMediaFeedItem[]> {
  const now = new Date().toISOString();
  const result = await env.META.prepare(
    `SELECT i.item_id, i.source_id, i.publisher_group_id, i.canonical_url, i.title,
            i.description_snippet, i.published_at, s.source_type, s.label
       FROM news_source_items i JOIN news_sources s ON s.source_id=i.source_id
      WHERE i.expires_at >= ? AND s.enabled=1
      ORDER BY COALESCE(i.published_at, i.first_seen_at) DESC LIMIT ?`,
  ).bind(now, limit).all<{
    item_id: string;
    source_id: string;
    publisher_group_id: string;
    canonical_url: string | null;
    title: string;
    description_snippet: string | null;
    published_at: string | null;
    source_type: "official" | "media" | "licensed-wire";
    label: string;
  }>();
  return (result.results ?? []).map((row) => ({
    dedupKey: row.item_id,
    feedId: row.source_id,
    publisherGroupId: row.publisher_group_id,
    sourceType: row.source_type,
    feedLabel: row.label,
    title: row.title,
    link: row.canonical_url ?? undefined,
    pubDate: row.published_at ?? undefined,
    descriptionSnippet: row.description_snippet ?? undefined,
  }));
}

export async function getDailyNewsUsage(env: Env, date: string): Promise<{
  newPublished: number;
  updatesPublished: number;
  aiNeuronsEstimated: number;
}> {
  const row = await env.META.prepare(
    "SELECT new_published, updates_published, ai_neurons_estimated FROM news_daily_usage WHERE usage_date=?",
  ).bind(date).first<{ new_published: number; updates_published: number; ai_neurons_estimated: number }>();
  return {
    newPublished: row?.new_published ?? 0,
    updatesPublished: row?.updates_published ?? 0,
    aiNeuronsEstimated: row?.ai_neurons_estimated ?? 0,
  };
}

export async function addDailyNewsUsage(
  env: Env,
  date: string,
  values: { newPublished?: number; updatesPublished?: number; aiNeuronsEstimated?: number },
): Promise<void> {
  await env.META.prepare(
    `INSERT INTO news_daily_usage (usage_date, new_published, updates_published, ai_neurons_estimated)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(usage_date) DO UPDATE SET
       new_published=new_published+excluded.new_published,
       updates_published=updates_published+excluded.updates_published,
       ai_neurons_estimated=ai_neurons_estimated+excluded.ai_neurons_estimated`,
  ).bind(date, values.newPublished ?? 0, values.updatesPublished ?? 0, values.aiNeuronsEstimated ?? 0).run();
}

export async function upsertNewsStory(
  env: Env,
  input: {
    storyId: string;
    clusterKey: string;
    slug: string;
    category: string;
    riskLevel: NewsRiskLevel;
    status: NewsStoryStatus;
  },
): Promise<void> {
  const now = new Date().toISOString();
  await env.META.prepare(
    `INSERT INTO news_stories
      (story_id, cluster_key, slug, category, risk_level, status, first_seen_at, last_seen_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(story_id) DO UPDATE SET
       last_seen_at=excluded.last_seen_at, risk_level=excluded.risk_level, status=excluded.status`,
  ).bind(input.storyId, input.clusterKey, input.slug, input.category, input.riskLevel, input.status, now, now).run();
}

export async function storyByClusterKey(env: Env, clusterKey: string): Promise<{
  storyId: string;
  slug: string;
  status: NewsStoryStatus;
  publishedAt?: string;
} | null> {
  const row = await env.META.prepare(
    "SELECT story_id, slug, status, published_at FROM news_stories WHERE cluster_key=? LIMIT 1",
  ).bind(clusterKey).first<{ story_id: string; slug: string; status: NewsStoryStatus; published_at: string | null }>();
  return row ? { storyId: row.story_id, slug: row.slug, status: row.status, publishedAt: row.published_at ?? undefined } : null;
}

export async function recordReviewDraft(
  env: Env,
  briefing: GundemBriefing,
  evidenceItemIds: readonly string[],
): Promise<void> {
  const storyId = briefing.storyId ?? briefing.slug;
  await upsertNewsStory(env, {
    storyId,
    clusterKey: briefing.syndication?.clusterId ?? storyId,
    slug: briefing.slug,
    category: briefing.category ?? "diger",
    riskLevel: briefing.riskLevel ?? "high",
    status: "REVIEW_REQUIRED",
  });
  if (evidenceItemIds.length) {
    await env.META.batch(evidenceItemIds.map((itemId) => env.META.prepare(
      `INSERT OR IGNORE INTO news_story_evidence (story_id, item_id, publisher_group_id, supports_claim_ids)
       SELECT ?, item_id, publisher_group_id, '[]' FROM news_source_items WHERE item_id=?`,
    ).bind(storyId, itemId)));
  }
}

export async function recordStoryEvidenceAndClaims(
  env: Env,
  briefing: GundemBriefing,
  items: readonly TrMediaFeedItem[],
): Promise<void> {
  const storyId = briefing.storyId ?? briefing.slug;
  const statements: D1PreparedStatement[] = [];
  for (const item of items) {
    statements.push(env.META.prepare(
      `INSERT OR REPLACE INTO news_story_evidence (story_id, item_id, publisher_group_id, supports_claim_ids)
       VALUES (?, ?, ?, ?)`,
    ).bind(
      storyId,
      item.dedupKey,
      item.publisherGroupId,
      JSON.stringify((briefing.claims ?? []).filter((claim) => claim.evidenceItemIds.includes(item.dedupKey)).map((claim) => claim.claimId)),
    ));
  }
  for (const claim of briefing.claims ?? []) {
    statements.push(env.META.prepare(
      `INSERT OR REPLACE INTO news_claims
        (claim_id, story_id, subject, predicate, value_text, unit, occurred_at, official_status, confidence, evidence_item_ids)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      `${storyId}:${claim.claimId}`,
      storyId,
      claim.subject,
      claim.predicate,
      claim.valueText ?? null,
      claim.unit ?? null,
      claim.occurredAt ?? null,
      claim.officialStatus,
      claim.confidence,
      JSON.stringify(claim.evidenceItemIds),
    ));
  }
  if (statements.length) await env.META.batch(statements);
}

export async function createPublishJob(
  env: Env,
  input: { idempotencyKey: string; storyId: string; revisionId: string },
): Promise<boolean> {
  const now = new Date().toISOString();
  const result = await env.META.prepare(
    `INSERT OR IGNORE INTO news_publish_jobs
      (idempotency_key, story_id, revision_id, status, created_at, updated_at)
     VALUES (?, ?, ?, 'started', ?, ?)`,
  ).bind(input.idempotencyKey, input.storyId, input.revisionId, now, now).run();
  return (result.meta.changes ?? 0) > 0;
}

export async function finishPublishJob(
  env: Env,
  idempotencyKey: string,
  status: "complete" | "failed",
  error?: string,
): Promise<void> {
  await env.META.prepare(
    `UPDATE news_publish_jobs SET status=?, attempts=attempts+1, last_error=?, updated_at=? WHERE idempotency_key=?`,
  ).bind(status, error ?? null, new Date().toISOString(), idempotencyKey).run();
}

export async function markStoryPublished(
  env: Env,
  briefing: GundemBriefing,
  revisionId: string,
  objectKey: string,
  contentHash: string,
  gateReport: unknown,
  revisionKind: "publish" | "update" | "correction" | "retraction" = "publish",
): Promise<void> {
  const storyId = briefing.storyId ?? briefing.slug;
  const now = new Date().toISOString();
  await env.META.batch([
    env.META.prepare(
      `INSERT INTO news_revisions
        (revision_id, story_id, revision_kind, object_key, content_hash, gate_report, model_version, prompt_version, approved_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(revisionId, storyId, revisionKind, objectKey, contentHash, JSON.stringify(gateReport), "@cf/meta/llama-3.2-3b-instruct", "news-v2", briefing.riskLevel === "high" ? "human" : "policy", now),
    env.META.prepare(
      `UPDATE news_stories SET status=?, published_at=COALESCE(published_at, ?),
       date_modified=?, current_revision_id=? WHERE story_id=?`,
    ).bind(revisionKind === "publish" ? "PUBLISHED" : revisionKind === "update" ? "UPDATED" : revisionKind === "correction" ? "CORRECTED" : "RETRACTED", briefing.publishedAt, briefing.dateModified, revisionId, storyId),
  ]);
}

export async function listReviewStories(env: Env): Promise<unknown[]> {
  const result = await env.META.prepare(
    `SELECT story_id, slug, category, risk_level, status, first_seen_at, last_seen_at
       FROM news_stories WHERE status='REVIEW_REQUIRED' ORDER BY last_seen_at DESC LIMIT 100`,
  ).all();
  return result.results ?? [];
}

export async function recordReviewAction(
  env: Env,
  input: { storyId: string; action: string; actor: string; detail?: string; idempotencyKey: string },
): Promise<boolean> {
  const result = await env.META.prepare(
    `INSERT OR IGNORE INTO news_review_actions
      (story_id, action, actor, detail, idempotency_key, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
  ).bind(input.storyId, input.action, input.actor, input.detail ?? null, input.idempotencyKey, new Date().toISOString()).run();
  return (result.meta.changes ?? 0) > 0;
}

export async function updateStoryStatus(env: Env, storyId: string, status: NewsStoryStatus): Promise<void> {
  await env.META.prepare("UPDATE news_stories SET status=?, last_seen_at=? WHERE story_id=?")
    .bind(status, new Date().toISOString(), storyId).run();
}

export async function createCorrectionRequest(env: Env, input: {
  requestId: string;
  storyId?: string;
  articleUrl: string;
  requesterName: string;
  requesterEmail: string;
  statement: string;
}): Promise<void> {
  await env.META.prepare(
    `INSERT INTO correction_requests
      (request_id, story_id, article_url, requester_name, requester_email, statement, received_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).bind(input.requestId, input.storyId ?? null, input.articleUrl, input.requesterName, input.requesterEmail, input.statement, new Date().toISOString()).run();
}
