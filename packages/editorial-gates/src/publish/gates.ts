import { assessContentSafety } from "../content-safety";
import { validateLicensedImage } from "../image-license";
import { isImageUrlReachable } from "../media-url";
import type { GundemBriefing } from "../gundem/types";
import type { TrMediaFeedItem } from "../gundem/feed-ingest";
import { assessNewsQuality } from "../gundem/news-quality";

export type GundemPublishGateResult =
  | { ok: true; briefing: GundemBriefing }
  | { ok: false; code: string; detail?: string };

export type GundemPublishGateExtras = {
  referenceHeadlines?: readonly string[];
  referenceSnippets?: readonly string[];
  editorialSource?: GundemBriefing["editorialSource"];
  evidenceItems?: readonly TrMediaFeedItem[];
};

export async function runGundemPublishGates(
  draft: GundemBriefing,
  extras: GundemPublishGateExtras = {},
): Promise<GundemPublishGateResult> {
  const safety = assessContentSafety({
    title: draft.title,
    body: draft.bodyMarkdown,
    excerpt: draft.excerpt,
    alt: draft.image?.alt,
    sources: draft.sources,
    channel: "gundem",
    editorialSource: extras.editorialSource ?? draft.editorialSource,
    referenceHeadlines: extras.referenceHeadlines,
    referenceSnippets: extras.referenceSnippets,
  });
  if (!safety.ok) {
    return { ok: false, code: safety.code, detail: safety.hits.join(",") };
  }

  if (extras.evidenceItems?.length) {
    const evidenceUrls = new Set(extras.evidenceItems.map((item) => item.link).filter(Boolean));
    const invalidSources = draft.sources.filter((source) => !evidenceUrls.has(source.url));
    if (invalidSources.length) {
      return { ok: false, code: "source-not-in-evidence", detail: invalidSources.map((source) => source.url).join(",") };
    }
    const independentGroups = new Set(extras.evidenceItems.map((item) => item.publisherGroupId));
    if (independentGroups.size < 2) {
      return { ok: false, code: "insufficient-independent-sources", detail: String(independentGroups.size) };
    }
    const quality = assessNewsQuality(draft, extras.evidenceItems);
    if (!quality.ok) {
      return { ok: false, code: quality.code, detail: quality.hits.join(",") };
    }
    draft = { ...draft, riskLevel: quality.riskLevel, status: quality.requiresReview ? "REVIEW_REQUIRED" : "GATED" };
  }

  const imageCheck = validateLicensedImage(draft.image);
  if (!imageCheck.ok) {
    return { ok: false, code: imageCheck.code, detail: imageCheck.reason };
  }

  if (draft.cover === "photo" || draft.cover === undefined) {
    const reachable = await isImageUrlReachable(draft.image.src);
    if (!reachable) {
      draft = { ...draft, cover: "type" };
    }
  }

  return { ok: true, briefing: draft };
}
