import assert from "node:assert/strict";
import test from "node:test";
import { assessContentSafety } from "./content-safety";

const longBody = `${"Engineering teams need explicit permission boundaries for multi-tenant copilots and retrieval indexes. ".repeat(30)}`;

test("rejects profanity in title", () => {
  const result = assessContentSafety({
    title: "This is amk broken",
    body: longBody,
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, "profanity");
});

test("allows kill switch phrase", () => {
  const body = `${longBody} Use a kill switch for emergency shutdown.`;
  const result = assessContentSafety({
    title: "Kill switch patterns",
    body,
  });
  assert.equal(result.ok, true);
});

test("rejects thin content", () => {
  const result = assessContentSafety({
    title: "Short",
    body: "Too short.",
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, "thin-content");
});

test("rejects headline copy from source title", () => {
  const result = assessContentSafety({
    title: "Permission Models for Multi-Tenant AI Copilots",
    body: longBody,
    sources: [
      {
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
        title: "Permission Models for Multi-Tenant AI Copilots",
      },
      { url: "https://nextjs.org/docs", title: "Other" },
    ],
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, "headline-copy");
});
