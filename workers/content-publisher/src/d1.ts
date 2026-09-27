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
