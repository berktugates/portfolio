import { stripLocalePrefix } from "./content/paths";

export type ContentGroup = "blog" | "gundem" | "hire" | "other";

/** GTM `page_context.content_group` — coarse site section for GA4 comparisons. */
export function contentGroupForPath(pathname: string, hostname = ""): ContentGroup {
  if (hostname === "haberler.berktugberke.com" || hostname === "haberler.localhost") {
    return "gundem";
  }
  const normalized = stripLocalePrefix(pathname.replace(/\/$/, "") || "/");
  if (normalized === "/gundem" || normalized.startsWith("/gundem/")) return "gundem";
  if (normalized === "/blogs" || normalized.startsWith("/blogs/")) return "blog";
  if (normalized === "/hire" || normalized.startsWith("/hire/")) return "hire";
  return "other";
}
