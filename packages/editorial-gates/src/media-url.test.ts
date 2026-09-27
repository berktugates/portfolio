import assert from "node:assert/strict";
import test from "node:test";
import { isImageUrlReachable } from "./media-url";
import { GUNDEM_PEXELS } from "./gundem/briefing-copy";

test("reachable pexels gold URL", async () => {
  assert.equal(await isImageUrlReachable(GUNDEM_PEXELS.gold), true);
});

test("broken pexels short path is not reachable", async () => {
  assert.equal(
    await isImageUrlReachable("https://images.pexels.com/photos/106152/pexels-photo-106152.jpeg"),
    false,
  );
});
