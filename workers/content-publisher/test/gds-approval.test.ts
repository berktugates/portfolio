import assert from "node:assert/strict";
import test from "node:test";
import { isGdsApprovedForSitePublish } from "../src/growthdaily/gds-approval";

test("requires published status by default", () => {
  assert.equal(isGdsApprovedForSitePublish({ status: "draft", reviewStatus: null }), false);
  assert.equal(isGdsApprovedForSitePublish({ status: "published", reviewStatus: null }), true);
  assert.equal(isGdsApprovedForSitePublish({ status: "draft", reviewStatus: "approved" }), true);
});

test("publishDrafts override", () => {
  assert.equal(
    isGdsApprovedForSitePublish({ status: "draft", reviewStatus: null }, { publishDrafts: true }),
    true,
  );
});
