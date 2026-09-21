import { resolve } from "node:path";
import { put } from "@vercel/blob";
import { haberlerArticlePath, HABERLER_ORIGIN } from "../../app/lib/gundem/hosts";
import type { GundemBriefing } from "../../app/lib/gundem/types";

export async function publishGundemBriefingToBlob(
  draft: GundemBriefing,
  rootDir: string,
): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required for gundem Blob publish.");
  }

  await put(`gundem/${draft.slug}.json`, JSON.stringify(draft), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  const indexUrl = process.env.BLOB_PUBLIC_BASE_URL
    ? `${process.env.BLOB_PUBLIC_BASE_URL.replace(/\/$/, "")}/gundem/index.json`
    : null;
  let index: { posts: GundemBriefing[] } = { posts: [] };
  if (indexUrl) {
    try {
      const res = await fetch(indexUrl);
      if (res.ok) index = (await res.json()) as { posts: GundemBriefing[] };
    } catch {
      /* start fresh */
    }
  }
  const merged = [draft, ...index.posts.filter((item) => item.slug !== draft.slug)].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  await put("gundem/index.json", JSON.stringify({ posts: merged }), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  const revalidateUrl = process.env.REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (revalidateUrl && secret) {
    const res = await fetch(revalidateUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paths: ["/gundem", `/gundem/${draft.slug}`, "/sitemap-gundem.xml", "/gundem/rss.xml"],
        tags: ["gundem"],
      }),
    });
    console.log(`Revalidate status: ${res.status}`);
  }

  const indexHost = process.env.HABERLER_HOST ?? new URL(HABERLER_ORIGIN).host;
  if (process.env.INDEXNOW_KEY) {
    const { execFileSync } = await import("node:child_process");
    const articlePath = haberlerArticlePath(draft.slug);
    execFileSync(
      "node",
      [
        resolve(rootDir, "scripts/indexnow-submit.mjs"),
        `https://${indexHost}${articlePath}`,
        `https://${indexHost}/`,
      ],
      { stdio: "inherit", cwd: rootDir },
    );
  }
}
