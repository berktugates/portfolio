import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = resolve(import.meta.dirname, "..");
const sourcePath = resolve(root, "app/data/blogs.ts");
const turkishContentPath = resolve(root, "app/content/blogs-tr.ts");
const outputPath = resolve(root, "public/blogs/feed.json");
const commonJsModule = loadTypeScriptModule(sourcePath);
const turkishModule = loadTypeScriptModule(turkishContentPath);
const turkishBlogs = turkishModule.exports.default ?? {};

const posts = commonJsModule.exports.blogPosts.map((post) => {
  const bodyPlain = post.sections
    .flatMap((section) => [...section.paragraphs, ...(section.points ?? [])])
    .join("\n\n");
  return {
    id: post.slug,
    slug: post.slug,
    title: post.title,
    url: `https://berktugberke.com/blogs/${post.slug}`,
    publishedAt: post.publishedAt,
    tags: [...post.keywords],
    excerpt: post.excerpt,
    bodyPlain,
    contentHash: createHash("sha256").update(bodyPlain).digest("hex").slice(0, 16),
    socialThreadTr: [...(post.socialThreadTr ?? buildTurkishThread(post, turkishBlogs[post.slug]))],
  };
});

const feed = {
  version: 1,
  site: "https://berktugberke.com",
  generatedAt: new Date().toISOString(),
  posts,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(feed, null, 2)}\n`);
console.log(`Generated ${posts.length} blog posts at ${outputPath}`);

function loadTypeScriptModule(filePath) {
  const source = readFileSync(filePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filePath,
  });
  const commonJsModule = { exports: {} };
  vm.runInNewContext(
    compiled.outputText,
    { module: commonJsModule, exports: commonJsModule.exports },
    { filename: filePath },
  );
  return commonJsModule;
}

function buildTurkishThread(post, localized) {
  if (!localized) {
    throw new Error(`Missing Turkish blog localization for ${post.slug}`);
  }
  const url = `https://berktugberke.com/tr/blogs/${post.slug}`;
  const title = localized.title;
  const firstParagraph = localized.sections?.[0]?.paragraphs?.[0] ?? localized.excerpt;
  const first = fitTweet(`${title}: ${firstParagraph}`, 260, false);
  const secondSource =
    localized.sections?.[1]?.paragraphs?.[0] ??
    localized.description ??
    localized.excerpt;
  const second = fitTweet(`${secondSource} Yazının tamamı: ${url}`, 280, true);
  return [first, second];
}

function fitTweet(text, max, keepUrl) {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= max) return compact;
  if (!keepUrl) return trimAtWord(compact, max - 1) + "…";
  const urlMatch = compact.match(/https:\/\/\S+$/);
  if (!urlMatch) return trimAtWord(compact, max - 1) + "…";
  const url = urlMatch[0];
  const prefixBudget = max - url.length - 2;
  return `${trimAtWord(compact.slice(0, urlMatch.index).trim(), prefixBudget - 1)}… ${url}`;
}

function trimAtWord(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim();
}
