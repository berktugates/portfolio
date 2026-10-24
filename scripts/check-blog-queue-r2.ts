/**
 * Git content/blog-queue ↔ R2 queue/blog/ parity (public CDN).
 * CI: CONTENT_PUBLIC_BASE_URL secret; yerel: ops:env-pull veya env.
 */
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { contentPublicBaseUrl } from "./lib/content-public-base";
import { loadOpsEnv } from "./lib/load-ops-env";

async function headOk(url: string): Promise<boolean> {
  const res = await fetch(url, { method: "HEAD", cache: "no-store" });
  return res.ok;
}

async function main() {
  const root = resolve(import.meta.dirname, "..");
  loadOpsEnv(root);

  const base = contentPublicBaseUrl();
  if (!base) {
    console.log(
      "OK blog-queue-r2: skipped (CONTENT_PUBLIC_BASE_URL unset; weekly-seo-blog CI’da secret ile çalışır)",
    );
    return;
  }

  const queueDir = resolve(root, "content/blog-queue");
  const names = (await readdir(queueDir)).filter((n) => n.endsWith(".json")).sort();
  if (names.length === 0) {
    console.error("FAIL blog-queue-r2: git queue empty");
    process.exit(1);
  }

  let errors = 0;
  for (const name of names) {
    const raw = await readFile(resolve(queueDir, name), "utf8");
    let slug = name.replace(/\.json$/, "");
    try {
      const parsed = JSON.parse(raw) as { slug?: string };
      if (parsed.slug) slug = parsed.slug;
    } catch {
      /* filename fallback */
    }
    const url = `${base}/queue/blog/${name}`;
    if (await headOk(url)) {
      console.log(`OK blog-queue-r2: ${name} (${slug})`);
    } else {
      console.error(`FAIL blog-queue-r2: missing on CDN ${url}`);
      errors += 1;
    }
  }

  console.log(`\nBlog queue R2: ${errors} error(s), ${names.length} git file(s).`);
  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
