import type { GrowthDailyPost } from "./types";

/** GDS Integrations: “review first” marks posts published only after human approval. */
export function isGdsApprovedForSitePublish(
  post: Pick<GrowthDailyPost, "status" | "reviewStatus">,
  opts?: { publishDrafts?: boolean },
): boolean {
  if (opts?.publishDrafts) return true;
  if (post.status === "published") return true;
  const review = (post.reviewStatus ?? "").toLowerCase();
  return review === "approved" || review === "published";
}
