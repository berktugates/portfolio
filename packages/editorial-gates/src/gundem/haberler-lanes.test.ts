import assert from "node:assert/strict";
import test from "node:test";
import {
  briefingMatchesLane,
  categoryToLane,
  isHaberlerLane,
  LEGACY_CATEGORY_TO_LANE,
} from "./haberler-lanes";

test("categoryToLane maps legacy buckets to gundem şeridi", () => {
  assert.equal(categoryToLane("siyaset"), "gundem");
  assert.equal(categoryToLane("diger"), "gundem");
  assert.equal(categoryToLane("bilisim"), "teknoloji");
});

test("briefingMatchesLane respects şerit", () => {
  assert.equal(briefingMatchesLane("ekonomi", "ekonomi"), true);
  assert.equal(briefingMatchesLane("siyaset", "gundem"), true);
  assert.equal(briefingMatchesLane("spor", "gundem"), false);
});

test("legacy URL keys redirect to lanes", () => {
  for (const [legacy, lane] of Object.entries(LEGACY_CATEGORY_TO_LANE)) {
    assert.ok(isHaberlerLane(lane), `${legacy} → ${lane}`);
  }
});
