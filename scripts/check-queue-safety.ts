/** Gündem kuyruğu: ulusal kapsam — docs/gundem-editorial.md, app/lib/gundem/editorial.ts */
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { assessContentSafety } from "../app/lib/content-safety";
import { extractBlogQueuePlainText } from "./lib/blog-queue-body";
import { assertQueueReadingPost } from "./lib/queue-reading-gate.mjs";

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
      channel:
        relative === "content/gundem-queue" || relative === "content/gundem-catalog"
          ? "gundem"
          : "blog",
      editorialSource:
        relative === "content/gundem-catalog"
          ? "catalog"
          : relative === "content/gundem-queue"
            ? ((raw.editorialSource as "headlines" | "curated" | "catalog" | undefined) ??
              "headlines")
            : undefined,
    });
    if (!result.ok) {
      throw new Error(`${relative}/${name}: ${result.code} ${result.hits.join(",")}`);
    }
    if (relative === "content/blog-queue") {
      assertQueueReadingPost(raw, `${relative}/${name}`);
      const tr = (raw.locales as { tr?: { title?: string } } | undefined)?.tr;
      const enTitle = String(raw.title ?? "");
      if (tr?.title && enTitle && tr.title === enTitle) {
        throw new Error(
          `${relative}/${name}: locales.tr.title mirrors English; add Turkish overlay (pnpm blog-queue:sync).`,
        );
      }
      const locales = raw.locales as Record<string, { title?: string }> | undefined;
      for (const code of ["de", "fr", "it", "zh", "ja"] as const) {
        const locTitle = locales?.[code]?.title;
        if (locTitle && enTitle && locTitle === enTitle) {
          throw new Error(
            `${relative}/${name}: locales.${code}.title mirrors English; add locale overlay (pnpm blog-queue:sync).`,
          );
        }
      }
      const enSections = raw.sections as { points?: string[] }[] | undefined;
      const trSections = (locales?.tr as { sections?: { points?: string[] }[] } | undefined)?.sections;
      if (enSections && trSections) {
        for (let i = 0; i < trSections.length; i++) {
          const trPoints = trSections[i]?.points;
          const enPoints = enSections[i]?.points;
          if (
            trPoints?.length &&
            enPoints?.length &&
            trPoints[0] === enPoints[0]
          ) {
            throw new Error(
              `${relative}/${name}: locales.tr sections[${i}].points mirror English; localize bullets (scripts/blog_queue_points.py).`,
            );
          }
        }
      }
    }
  }
}

async function main() {
  await scanDir("content/blog-queue");
  await scanDir("content/gundem-queue");
  await scanDir("content/gundem-catalog");
  console.log("Queue safety checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
