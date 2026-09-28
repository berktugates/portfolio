import { test } from "node:test";
import assert from "node:assert/strict";
import { shouldRecordFeedResult } from "../src/haber-cron";

test("circuit-open skips do not count as fresh source failures", () => {
  assert.equal(shouldRecordFeedResult("skipped"), false);
  assert.equal(shouldRecordFeedResult("failed"), true);
  assert.equal(shouldRecordFeedResult("ok"), true);
});
