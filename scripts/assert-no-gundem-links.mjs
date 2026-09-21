import { readdir, readFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const root = resolve(import.meta.dirname, "..");
const scanRoots = [
  resolve(root, "app/components/home-page.tsx"),
  resolve(root, "app/components/site-footer.tsx"),
  resolve(root, "app/components/blogs-index-view.tsx"),
  resolve(root, "app/components/blog-detail.tsx"),
  resolve(root, "app/lib/site-assistant/copy.ts"),
];

async function walk(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "gundem") continue;
      await walk(full, acc);
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

const hireFiles = await walk(resolve(root, "app"), []);
const files = [...new Set([...scanRoots, ...hireFiles.filter((f) => /\/hire\//.test(f))])];

const forbidden = [
  "/gundem",
  "href=\"/gundem",
  "href='/gundem",
  "`/gundem",
  "haberler.berktugberke.com",
];

for (const file of files) {
  if (file.includes("/app/gundem/")) continue;
  if (file.includes("gundem-index-view") || file.includes("gundem-detail-view")) continue;
  if (file.includes("assert-no-gundem-links")) continue;
  if (file.includes("llms.txt/route")) continue;
  if (file.includes("gundem/hosts")) continue;
  const text = await readFile(file, "utf8");
  for (const needle of forbidden) {
    if (text.includes(needle)) {
      console.error(`Forbidden gundem link in ${file}: ${needle}`);
      process.exit(1);
    }
  }
}

console.log("No gundem links in portfolio graph files.");
