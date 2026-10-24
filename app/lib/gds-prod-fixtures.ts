/** Auto-synced from D1 (2026-10-24) via pnpm gds:sync-fixtures */

/** Today's Istanbul cap slot (prod regression). */
export const GDS_PROD_PUBLISHED_SLUG = "single-tenant-vs-multi-tenant-examples-operator-focused-trade-offs";

/** Deferred by daily cap (expect 404 on site); null if none today. */
export const GDS_PROD_CAP_DEFERRED_SLUG = "rbac-vs-abac-for-ai-copilots-in-multi-tenant-saas";

export function gdsProdBlogUrl(slug: string): string {
  return `https://berktugberke.com/blogs/${slug}`;
}
