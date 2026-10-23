export async function getGrowthDailySyncCursor(env: Env): Promise<string | null> {
  const row = await env.META.prepare(
    "SELECT cursor_at FROM growthdaily_sync WHERE id = 1 LIMIT 1",
  ).first<{ cursor_at: string }>();
  return row?.cursor_at ?? null;
}

export async function setGrowthDailySyncCursor(env: Env, cursorAt: string): Promise<void> {
  await env.META.prepare(
    "INSERT INTO growthdaily_sync (id, cursor_at) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET cursor_at = excluded.cursor_at",
  )
    .bind(cursorAt)
    .run();
}

export async function getGrowthDailyIngestState(
  env: Env,
  postId: string,
): Promise<{ updatedAt: string; slug: string } | null> {
  const row = await env.META.prepare(
    "SELECT updated_at, slug FROM growthdaily_ingest WHERE post_id = ? LIMIT 1",
  )
    .bind(postId)
    .first<{ updated_at: string; slug: string }>();
  return row ? { updatedAt: row.updated_at, slug: row.slug } : null;
}

export async function recordGrowthDailyIngest(
  env: Env,
  input: { postId: string; slug: string; updatedAt: string; language: string },
): Promise<void> {
  await env.META.prepare(
    `INSERT INTO growthdaily_ingest (post_id, slug, updated_at, language)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(post_id) DO UPDATE SET slug=excluded.slug, updated_at=excluded.updated_at, language=excluded.language`,
  )
    .bind(input.postId, input.slug, input.updatedAt, input.language)
    .run();
}

export async function slugPublishedInChannel(env: Env, slug: string, channel: string): Promise<boolean> {
  const row = await env.META.prepare(
    "SELECT 1 FROM published_slugs WHERE slug = ? AND channel = ? LIMIT 1",
  )
    .bind(slug, channel)
    .first();
  return row !== null;
}

export async function recordPublishedSlug(env: Env, slug: string, channel: string, at: string): Promise<void> {
  await env.META.prepare(
    "INSERT OR REPLACE INTO published_slugs (slug, channel, published_at) VALUES (?, ?, ?)",
  )
    .bind(slug, channel, at)
    .run();
}

export async function countDailyPublishes(env: Env, istanbulDay: string): Promise<number> {
  const row = await env.META.prepare(
    "SELECT COUNT(*) AS n FROM growthdaily_daily_publish WHERE istanbul_day = ?",
  )
    .bind(istanbulDay)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function hasDailyPublishRow(env: Env, istanbulDay: string, postId: string): Promise<boolean> {
  const row = await env.META.prepare(
    "SELECT 1 AS x FROM growthdaily_daily_publish WHERE istanbul_day = ? AND post_id = ? LIMIT 1",
  )
    .bind(istanbulDay, postId)
    .first();
  return row !== null && row !== undefined;
}

/**
 * Atomically claims one slot for the day (single statement => safe against concurrent webhooks).
 * Returns false when the cap is already reached.
 */
export async function reserveDailyPublishSlot(
  env: Env,
  input: { istanbulDay: string; postId: string; slug: string; qualityBand: string | null; at: string; cap: number },
): Promise<boolean> {
  const res = await env.META.prepare(
    `INSERT INTO growthdaily_daily_publish (istanbul_day, post_id, slug, quality_band, reserved_at)
     SELECT ?, ?, ?, ?, ?
     WHERE (SELECT COUNT(*) FROM growthdaily_daily_publish WHERE istanbul_day = ?) < ?`,
  )
    .bind(input.istanbulDay, input.postId, input.slug, input.qualityBand, input.at, input.istanbulDay, input.cap)
    .run();
  return (res.meta?.changes ?? 0) > 0;
}

export async function releaseDailyPublishSlot(env: Env, istanbulDay: string, postId: string): Promise<void> {
  await env.META.prepare("DELETE FROM growthdaily_daily_publish WHERE istanbul_day = ? AND post_id = ?")
    .bind(istanbulDay, postId)
    .run();
}
