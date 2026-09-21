import { readdir, readFile, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import { assessContentSafety } from "../app/lib/content-safety";
import { validateLicensedImage } from "../app/lib/image-license";
import type { GundemBriefing } from "../app/lib/gundem/types";
import { GUNDEM_EDITORIAL_MISSION } from "../app/lib/gundem/editorial";
import { publishGundemBriefingToBlob } from "./lib/gundem-blob-publish";

const root = resolve(import.meta.dirname, "..");
const queueDir = resolve(root, "content/gundem-queue");

async function blobBriefingIfExists(slug: string): Promise<GundemBriefing | null> {
  const base = process.env.BLOB_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  try {
    const res = await fetch(`${base}/gundem/${slug}.json`);
    if (!res.ok) return null;
    return (await res.json()) as GundemBriefing;
  } catch {
    return null;
  }
}

async function main() {
  const files = (await readdir(queueDir)).filter((name) => name.endsWith(".json")).sort();
  if (files.length === 0) {
    console.log(`Gundem queue empty; nothing to publish. (${GUNDEM_EDITORIAL_MISSION})`);
    return;
  }

  const selected = files[0];
  const queuePath = resolve(queueDir, selected);
  const draft = JSON.parse(await readFile(queuePath, "utf8")) as GundemBriefing;

  const legacyBody =
    "draftBody" in draft && typeof (draft as Record<string, unknown>).draftBody === "string"
      ? String((draft as Record<string, unknown>).draftBody)
      : "";
  const body = draft.bodyMarkdown ?? legacyBody;
  const safety = assessContentSafety({
    title: draft.title,
    body,
    excerpt: draft.excerpt,
    alt: draft.image?.alt,
    sources: draft.sources,
  });
  if (!safety.ok) {
    console.error(`Safety rejected: ${safety.code}`, safety.hits);
    process.exit(1);
  }

  const imageCheck = validateLicensedImage(draft.image);
  if (!imageCheck.ok) {
    console.error(`Image rejected: ${imageCheck.code}`, imageCheck.reason);
    process.exit(1);
  }

  const existing = await blobBriefingIfExists(draft.slug);
  if (existing?.dateModified === draft.dateModified && existing?.title === draft.title) {
    await unlink(queuePath);
    console.log(`Blob already has ${draft.slug} (${draft.dateModified}); removed queue file.`);
    return;
  }

  await publishGundemBriefingToBlob(draft, root);
  await unlink(queuePath);
  console.log(`Published gundem briefing ${draft.slug} to Blob.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
