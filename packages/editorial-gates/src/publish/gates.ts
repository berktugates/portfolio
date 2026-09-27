import { assessContentSafety } from "../content-safety";
import { validateLicensedImage } from "../image-license";
import { isImageUrlReachable } from "../media-url";
import type { GundemBriefing } from "../gundem/types";

export type GundemPublishGateResult =
  | { ok: true; briefing: GundemBriefing }
  | { ok: false; code: string; detail?: string };

export async function runGundemPublishGates(draft: GundemBriefing): Promise<GundemPublishGateResult> {
  const safety = assessContentSafety({
    title: draft.title,
    body: draft.bodyMarkdown,
    excerpt: draft.excerpt,
    alt: draft.image?.alt,
    sources: draft.sources,
    channel: "gundem",
  });
  if (!safety.ok) {
    return { ok: false, code: safety.code, detail: safety.hits.join(",") };
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
