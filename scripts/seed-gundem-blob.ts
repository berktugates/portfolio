import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { assessContentSafety } from "../app/lib/content-safety";
import { validateLicensedImage } from "../app/lib/image-license";
import type { GundemBriefing } from "../app/lib/gundem/types";
import { GUNDEM_EDITORIAL_MISSION } from "../app/lib/gundem/editorial";
import { seedGundemBriefingsToR2 } from "./lib/content-r2-publish";

const root = resolve(import.meta.dirname, "..");

async function main() {
  console.log(`Gundem seed mission: ${GUNDEM_EDITORIAL_MISSION}`);
  const raw = await readFile(resolve(root, "content/gundem-seed.json"), "utf8");
  const { posts } = JSON.parse(raw) as { posts: GundemBriefing[] };
  if (!posts?.length) {
    console.log("gundem-seed.json has no posts; nothing to seed.");
    return;
  }

  const validated: GundemBriefing[] = [];
  for (const draft of posts) {
    const body = draft.bodyMarkdown ?? "";
    const safety = assessContentSafety({
      title: draft.title,
      body,
      excerpt: draft.excerpt,
      alt: draft.image?.alt,
      sources: draft.sources,
      channel: "gundem",
    });
    if (!safety.ok) {
      console.error(`Safety rejected ${draft.slug}: ${safety.code}`, safety.hits);
      process.exit(1);
    }

    const imageCheck = validateLicensedImage(draft.image);
    if (!imageCheck.ok) {
      console.error(`Image rejected ${draft.slug}: ${imageCheck.code}`, imageCheck.reason);
      process.exit(1);
    }
    validated.push(draft);
  }

  await seedGundemBriefingsToR2(validated);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
