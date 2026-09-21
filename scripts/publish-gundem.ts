import { readdir, readFile, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import { put } from "@vercel/blob";
import { assessContentSafety } from "../app/lib/content-safety";
import { validateLicensedImage } from "../app/lib/image-license";
import { haberlerArticlePath, HABERLER_ORIGIN } from "../app/lib/gundem/hosts";
import type { GundemBriefing } from "../app/lib/gundem/types";

const root = resolve(import.meta.dirname, "..");
const queueDir = resolve(root, "content/gundem-queue");

async function main() {
  const files = (await readdir(queueDir)).filter((name) => name.endsWith(".json")).sort();
  if (files.length === 0) {
    console.log("Gundem queue empty; nothing to publish.");
    return;
  }

  const selected = files[0];
  const draft = JSON.parse(await readFile(resolve(queueDir, selected), "utf8")) as GundemBriefing;

  const body = draft.bodyMarkdown ?? "";
  const safety = assessContentSafety({
    title: draft.title,
    body,
    excerpt: draft.excerpt,
    alt: draft.image?.alt,
    sources: draft.sources,
  });
  if (!safety.ok) {
    console.error(`Safety rejected: ${safety.code}`, safety.hits);
    process.exit(1);
  }

  const imageCheck = validateLicensedImage(draft.image);
  if (!imageCheck.ok) {
    console.error(`Image rejected: ${imageCheck.code}`, imageCheck.reason);
    process.exit(1);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN is required for gundem publish.");
    process.exit(1);
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

  await unlink(resolve(queueDir, selected));
  console.log(`Published gundem briefing ${draft.slug} to Blob.`);

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
        "scripts/indexnow-submit.mjs",
        `https://${indexHost}${articlePath}`,
        `https://${indexHost}/`,
      ],
      { stdio: "inherit", cwd: root },
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
