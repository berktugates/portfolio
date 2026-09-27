export async function revalidate(env: Env, paths: string[], tags: string[]): Promise<number> {
  const secret = env.REVALIDATE_SECRET;
  const url = env.REVALIDATE_URL;
  if (!secret || !url) return 0;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paths, tags }),
  });
  return res.status;
}

export async function flushRevalidatePending(env: Env): Promise<void> {
  if (!env.META) return;
  const rows = await env.META.prepare("SELECT path FROM revalidate_pending").all<{ path: string }>();
  const paths = rows.results?.map((r) => r.path) ?? [];
  if (paths.length === 0) return;
  const status = await revalidate(env, paths, ["gundem", "blogs"]);
  if (status === 204 || status === 200) {
    for (const path of paths) {
      await env.META.prepare("DELETE FROM revalidate_pending WHERE path = ?").bind(path).run();
    }
  }
}

export async function revalidateOrQueue(env: Env, paths: string[], tags: string[]): Promise<void> {
  const status = await revalidate(env, paths, tags);
  if (status === 204 || status === 200) return;
  if (!env.META) return;
  const now = new Date().toISOString();
  for (const path of paths) {
    await env.META.prepare(
      "INSERT OR REPLACE INTO revalidate_pending (path, created_at) VALUES (?, ?)",
    )
      .bind(path, now)
      .run();
  }
}
