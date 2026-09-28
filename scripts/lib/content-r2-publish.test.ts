import assert from "node:assert/strict";
import test from "node:test";
import type { GundemBriefing } from "../../app/lib/gundem/types";
import { mergeGundemIndexPosts } from "./content-r2-publish";

function briefing(slug: string, publishedAt: string, title = slug): GundemBriefing {
  return { slug, publishedAt, dateModified: publishedAt, title } as GundemBriefing;
}

test("seed index merge preserves previously published stories", () => {
  const published = briefing("worker-story", "2026-09-28T12:00:00.000Z");
  const seed = briefing("seed-story", "2026-09-29T12:00:00.000Z");

  assert.deepEqual(
    mergeGundemIndexPosts([published], [seed]).map((post) => post.slug),
    ["seed-story", "worker-story"],
  );
});

test("seed index merge updates the matching slug without duplication", () => {
  const previous = briefing("same-story", "2026-09-27T12:00:00.000Z", "old");
  const updated = briefing("same-story", "2026-09-29T12:00:00.000Z", "updated");
  const merged = mergeGundemIndexPosts([previous], [updated]);

  assert.equal(merged.length, 1);
  assert.equal(merged[0]?.title, "updated");
});
