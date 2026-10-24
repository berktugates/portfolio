function indexNowHost(urls: readonly string[], env: Env): string {
  for (const raw of urls) {
    try {
      return new URL(raw).hostname;
    } catch {
      /* try next */
    }
  }
  return env.INDEXNOW_HOST ?? env.HABERLER_HOST ?? "berktugberke.com";
}

export async function submitIndexNow(env: Env, urls: string[]): Promise<void> {
  if (!env.INDEXNOW_KEY || urls.length === 0) return;
  const host = indexNowHost(urls, env);
  await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ host, key: env.INDEXNOW_KEY, urlList: urls }),
  });
}
