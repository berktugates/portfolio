const QUEUE_PREFIX = "queue/blog/";

export async function contentOpsSnapshot(env: Env) {
  const listed = await env.CONTENT_BUCKET.list({ prefix: QUEUE_PREFIX, limit: 200 });
  const queueKeys = listed.objects
    .map((o) => o.key)
    .filter((k): k is string => Boolean(k?.endsWith(".json")))
    .sort();

  const pendingRow = await env.META.prepare("SELECT COUNT(*) AS c FROM revalidate_pending").first<{ c: number }>();
  const recent = await env.META.prepare(
    "SELECT slug, channel, published_at FROM published_slugs ORDER BY published_at DESC LIMIT 8",
  ).all<{ slug: string; channel: string; published_at: string }>();

  return {
    queueObjectCount: queueKeys.length,
    queueOldestKey: queueKeys[0] ?? null,
    revalidatePending: pendingRow?.c ?? 0,
    recentPublishes: recent.results ?? [],
    githubDispatchConfigured: Boolean(
      env.GITHUB_DISPATCH_TOKEN?.trim() && env.GITHUB_REPOSITORY?.trim(),
    ),
    blogQueueCron: "0 9 * * *",
    gitQueueSyncCronHint: "15 4 * * * (GitHub Actions weekly-seo-blog.yml)",
  };
}
