/** Known prod slugs for cap / publish regression probes (update when daily cap rotates). */
export const GDS_PROD_PUBLISHED_SLUG =
  "single-tenant-vs-multi-tenant-examples-operator-focused-trade-offs";

/** Second approved post deferred by Istanbul daily cap (expect 404 on site). */
export const GDS_PROD_CAP_DEFERRED_SLUG = "rbac-vs-abac-for-ai-copilots-in-multi-tenant-saas";

export function gdsProdBlogUrl(slug: string): string {
  return `https://berktugberke.com/blogs/${slug}`;
}
