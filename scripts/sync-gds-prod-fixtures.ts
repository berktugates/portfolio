/**
 * Writes app/lib/gds-prod-fixtures.ts from remote D1 (Istanbul day cap rows).
 */
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { resolveGdsFixturesFromD1 } from "./lib/gds-d1-fixtures";

const outPath = resolve(import.meta.dirname, "../app/lib/gds-prod-fixtures.ts");

async function main() {
  const { istanbulDay, publishedSlug, deferredSlug } = resolveGdsFixturesFromD1();
  if (!publishedSlug) {
    console.error("No growthdaily_daily_publish row for today; fixtures unchanged.");
    process.exit(1);
  }
  const content = `/** Auto-synced from D1 (${istanbulDay}) via pnpm gds:sync-fixtures */

/** Today's Istanbul cap slot (prod regression). */
export const GDS_PROD_PUBLISHED_SLUG = ${JSON.stringify(publishedSlug)};

/** Deferred by daily cap (expect 404 on site); null if none today. */
export const GDS_PROD_CAP_DEFERRED_SLUG = ${JSON.stringify(deferredSlug ?? "rbac-vs-abac-for-ai-copilots-in-multi-tenant-saas")};

export function gdsProdBlogUrl(slug: string): string {
  return \`https://berktugberke.com/blogs/\${slug}\`;
}
`;
  await writeFile(outPath, content, "utf8");
  console.log(`Updated ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
