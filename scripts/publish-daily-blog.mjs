#!/usr/bin/env node
/**
 * Publish the next SEO blog from content/blog-queue/ into the live content tree.
 *
 * Queue filename: YYYY-MM-DD-slug.json
 * Idempotent: skips if blogs.ts already contains publishedAt for the target day.
 */
import { readdir, readFile, writeFile, unlink } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const queueDir = resolve(root, "content/blog-queue");
const blogsPath = resolve(root, "app/data/blogs.ts");
const seoPath = resolve(root, "app/lib/seo.ts");
const localeFiles = {
  tr: resolve(root, "app/content/blogs-tr.ts"),
  de: resolve(root, "app/content/blogs-de.ts"),
  fr: resolve(root, "app/content/blogs-fr.ts"),
  it: resolve(root, "app/content/blogs-it.ts"),
  zh: resolve(root, "app/content/blogs-zh.ts"),
  ja: resolve(root, "app/content/blogs-ja.ts"),
};

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const forceDate = [...args].find((arg) => /^\d{4}-\d{2}-\d{2}$/.test(arg));

const targetDate = forceDate ?? istanbulDate();
const blogsSource = await readFile(blogsPath, "utf8");

if (blogsSource.includes(`publishedAt: "${targetDate}"`)) {
  console.log(`Skip: a blog already published for ${targetDate}`);
  process.exit(0);
}

const queueFiles = (await readdir(queueDir))
  .filter((name) => name.endsWith(".json") && !name.startsWith("."))
  .sort();

if (queueFiles.length === 0) {
  console.error("Blog queue is empty. Add files under content/blog-queue/");
  process.exit(1);
}

const preferred = queueFiles.find((name) => name.startsWith(`${targetDate}-`));
const selectedName = preferred ?? queueFiles[0];
const selectedPath = resolve(queueDir, selectedName);
const post = JSON.parse(await readFile(selectedPath, "utf8"));

assertPost(post);
if (blogsSource.includes(`slug: "${post.slug}"`)) {
  console.error(`Slug already exists: ${post.slug}`);
  process.exit(1);
}

const enObject = {
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  description: post.description,
  publishedAt: targetDate,
  readingMinutes: post.readingMinutes,
  keywords: post.keywords,
  socialThreadTr: post.socialThreadTr,
  sections: post.sections,
};

const enLiteral = `${toTs(enObject, 2)},\n  `;
const blogsNeedle = "export const blogPosts: readonly BlogPost[] = [\n";
if (!blogsSource.includes(blogsNeedle)) {
  throw new Error("Could not find blogPosts array start");
}
const nextBlogs = blogsSource.replace(blogsNeedle, `${blogsNeedle}  ${enLiteral}`);

const nextLocales = {};
for (const [locale, filePath] of Object.entries(localeFiles)) {
  const localeCopy = post.locales?.[locale];
  if (!localeCopy) throw new Error(`Missing locale overlay: ${locale}`);
  const source = await readFile(filePath, "utf8");
  const needle = "const blogs: BlogLocaleMap = {\n";
  if (!source.includes(needle)) throw new Error(`Locale map not found in ${locale}`);
  const entry = `${toTs(post.slug, 2)}: ${toTs(
    {
      title: localeCopy.title,
      excerpt: localeCopy.excerpt,
      description: localeCopy.description,
      sections: localeCopy.sections,
    },
    2,
  )},\n`;
  nextLocales[locale] = { filePath, source: source.replace(needle, `${needle}${entry}`) };
}

const nextSeo = (await readFile(seoPath, "utf8")).replace(
  /export const SITE_LAST_MODIFIED = "[^"]+";/,
  `export const SITE_LAST_MODIFIED = "${targetDate}T09:00:00+03:00";`,
);

if (dryRun) {
  console.log(`[dry-run] Would publish ${post.slug} for ${targetDate} from ${selectedName}`);
  process.exit(0);
}

await writeFile(blogsPath, nextBlogs);
for (const locale of Object.values(nextLocales)) {
  await writeFile(locale.filePath, locale.source);
}
await writeFile(seoPath, nextSeo);
await unlink(selectedPath);

console.log(`Published ${post.slug} for ${targetDate} (from ${selectedName})`);

function istanbulDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function assertPost(value) {
  for (const key of ["slug", "title", "excerpt", "description", "readingMinutes", "keywords", "sections", "locales", "socialThreadTr"]) {
    if (value[key] == null) throw new Error(`Queue post missing ${key}`);
  }
  for (const locale of Object.keys(localeFiles)) {
    if (!value.locales[locale]) throw new Error(`Queue post missing locales.${locale}`);
  }
}

function toTs(value, indent = 0) {
  const pad = " ".repeat(indent);
  const padInner = " ".repeat(indent + 2);
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((item) => `${padInner}${toTs(item, indent + 2)}`);
    return `[\n${items.join(",\n")},\n${pad}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return "{}";
    const body = entries
      .map(([key, child]) => {
        const safeKey = /^[A-Za-z_][A-Za-z0-9_]*$/.test(key) ? key : JSON.stringify(key);
        return `${padInner}${safeKey}: ${toTs(child, indent + 2)}`;
      })
      .join(",\n");
    return `{\n${body},\n${pad}}`;
  }
  throw new Error(`Unsupported value: ${String(value)}`);
}
