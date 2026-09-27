import { GetObjectCommand } from "@aws-sdk/client-s3";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { contentPublicBaseUrl } from "./lib/content-public-base";
import { createR2Client } from "./lib/r2-s3-client";

const execFileAsync = promisify(execFile);

async function fetchJson(url: string): Promise<unknown> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    const cause = error instanceof Error ? error.cause : undefined;
    const sslWrongVersion =
      error instanceof Error &&
      (error.message.includes("ERR_SSL_WRONG_VERSION_NUMBER") ||
        (cause instanceof Error && cause.message.includes("wrong version number")));
    if (!sslWrongVersion) {
      throw error;
    }
    const { stdout } = await execFileAsync("curl", ["-sS", "--http1.1", url]);
    return JSON.parse(stdout) as unknown;
  }
}

async function main() {
  const base = contentPublicBaseUrl();
  if (!base) {
    console.log("Skip R2 index verify: CONTENT_PUBLIC_BASE_URL unset.");
    return;
  }

  const root = resolve(import.meta.dirname, "..");
  const seedRaw = await readFile(resolve(root, "content/gundem-seed.json"), "utf8");
  const expectedSlugs = ((JSON.parse(seedRaw) as { posts: { slug: string }[] }).posts ?? []).map(
    (p) => p.slug,
  );
  if (!expectedSlugs.length) {
    console.error("gundem-seed.json has no posts to verify.");
    process.exit(1);
  }

  const indexUrl = `${base}/gundem/index.json`;
  let data: { posts: { slug: string }[] };
  try {
    data = (await fetchJson(indexUrl)) as { posts: { slug: string }[] };
  } catch {
    const bucket = process.env.R2_BUCKET_NAME;
    if (bucket && process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
      try {
        const client = createR2Client();
        const out = await client.send(
          new GetObjectCommand({ Bucket: bucket, Key: "gundem/index.json" }),
        );
        const raw = await out.Body?.transformToString();
        if (!raw) {
          throw new Error("empty index body");
        }
        data = JSON.parse(raw) as { posts: { slug: string }[] };
      } catch (s3Error) {
        console.error(`R2 index fetch failed (public URL and S3): ${indexUrl}`, s3Error);
        process.exit(1);
      }
    } else {
      console.error(`R2 index fetch failed: ${indexUrl}`);
      process.exit(1);
    }
  }
  const indexSlugs = new Set(data.posts?.map((p) => p.slug) ?? []);
  const missing = expectedSlugs.filter((slug) => !indexSlugs.has(slug));
  if (missing.length > 0) {
    console.error(
      `R2 index missing seed slugs: ${missing.join(", ")}; index has: ${[...indexSlugs].join(", ") || "none"}`,
    );
    process.exit(1);
  }
  console.log(`R2 index OK (${expectedSlugs.length} seed slugs): ${expectedSlugs.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
