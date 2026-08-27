import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = resolve(import.meta.dirname, "..");
const sourcePath = resolve(root, "app/data/blogs.ts");
const outputPath = resolve(root, "public/blogs/feed.json");
const source = await readFile(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  fileName: sourcePath,
});
const commonJsModule = { exports: {} };
vm.runInNewContext(
  compiled.outputText,
  { module: commonJsModule, exports: commonJsModule.exports },
  { filename: sourcePath },
);

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
    ...(post.socialThreadTr ? { socialThreadTr: [...post.socialThreadTr] } : {}),
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
