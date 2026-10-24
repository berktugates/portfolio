import assert from "node:assert/strict";
import test from "node:test";
import { coverModeForStory, pickStoryCoverImage } from "./story-cover";

test("pickStoryCoverImage returns licensed https src per lane", () => {
  const img = pickStoryCoverImage({
    category: "spor",
    title: "Fenerbahçe maçı",
    seed: "test-spor-a",
  });
  assert.match(img.src, /^https:\/\/images\.pexels\.com\//);
  assert.ok(img.alt.length >= 10);
  assert.equal(img.license, "pexels");
});

test("pickStoryCoverImage avoids duplicate src when usedSrc set", () => {
  const first = pickStoryCoverImage({
    category: "gundem",
    title: "Ankara gündemi",
    seed: "dup-seed",
  });
  const used = new Set([first.src]);
  const second = pickStoryCoverImage({
    category: "gundem",
    title: "Ankara gündemi",
    seed: "dup-seed",
    usedSrc: used,
  });
  assert.notEqual(second.src, first.src);
});

test("coverModeForStory is always photo", () => {
  assert.equal(coverModeForStory(), "photo");
});
