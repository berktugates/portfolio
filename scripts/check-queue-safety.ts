/** Gündem kuyruğu: ulusal kapsam — docs/gundem-editorial.md, app/lib/gundem/editorial.ts */
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { assessContentSafety } from "../app/lib/content-safety";
import { extractBlogQueuePlainText } from "./lib/blog-queue-body";

const root = resolve(import.meta.dirname, "..");

async function scanDir(relative: string) {
  const dir = resolve(root, relative);
  let names: string[] = [];
  try {
    names = (await readdir(dir)).filter((name) => name.endsWith(".json"));
  } catch {
    return;
  }
  for (const name of names) {
    const raw = JSON.parse(await readFile(resolve(dir, name), "utf8")) as Record<string, unknown>;
    const body =
      relative === "content/blog-queue"
        ? extractBlogQueuePlainText(raw)
        : typeof raw.draftBody === "string"
          ? raw.draftBody
          : typeof raw.bodyMarkdown === "string"
            ? raw.bodyMarkdown
            : JSON.stringify(raw.sections ?? raw);
    const title = String(raw.title ?? name);
    const result = assessContentSafety({
      title,
      body,
      excerpt: typeof raw.excerpt === "string" ? raw.excerpt : undefined,
      sources: Array.isArray(raw.sources)
        ? raw.sources.map((item) =>
            typeof item === "string" ? { url: item } : (item as { url: string; title?: string }),
          )
        : undefined,
    });
    if (!result.ok) {
      throw new Error(`${relative}/${name}: ${result.code} ${result.hits.join(",")}`);
    }
  }
}

async function main() {
  await scanDir("content/blog-queue");
  await scanDir("content/gundem-queue");
  console.log("Queue safety checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
