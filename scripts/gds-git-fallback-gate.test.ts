import assert from "node:assert/strict";
import test from "node:test";
import { gdsPublishedToday, type GdsOpsSnapshot } from "./lib/gds-ops-snapshot";

test("gdsPublishedToday when count or slug list non-empty", () => {
  const empty: GdsOpsSnapshot = {
    istanbulDay: "2026-10-24",
    cap: 1,
    countToday: 0,
    publishedToday: [],
  };
  assert.equal(gdsPublishedToday(empty), false);

  assert.equal(
    gdsPublishedToday({ ...empty, countToday: 1 }),
    true,
  );
  assert.equal(
    gdsPublishedToday({ ...empty, publishedToday: [{ slug: "foo" }] }),
    true,
  );
});
