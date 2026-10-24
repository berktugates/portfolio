/** Opsiyonel: R2 yayın sonrası GitHub Actions (newsletter, smoke). */
export async function dispatchBlogPublished(
  env: Env,
  payload: { slug: string; source: "queue" | "growthdaily" },
): Promise<void> {
  const token = env.GITHUB_DISPATCH_TOKEN?.trim();
  const repo = env.GITHUB_REPOSITORY?.trim();
  if (!token || !repo) return;

  const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_type: "blog-published",
      client_payload: payload,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.warn(`github-dispatch: HTTP ${res.status} ${text.slice(0, 200)}`);
  } else {
    console.log(`github-dispatch: blog-published slug=${payload.slug} source=${payload.source}`);
  }
}
