export async function submitIndexNow(env: Env, urls: string[]): Promise<void> {
  if (!env.INDEXNOW_KEY || urls.length === 0) return;
  const host = env.HABERLER_HOST ?? "haberler.berktugberke.com";
  await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ host, key: env.INDEXNOW_KEY, urlList: urls }),
  });
}
