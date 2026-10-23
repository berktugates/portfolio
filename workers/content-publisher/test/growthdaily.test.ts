import assert from "node:assert/strict";
import test from "node:test";
import { verifyGrowthDailyWebhook } from "../src/growthdaily/verify";
import { sanitizeArticleHtml } from "../src/growthdaily/sanitize";

test("verifyGrowthDailyWebhook accepts valid HMAC", async () => {
  const secret = "test-secret";
  const rawBody = '{"event":"webhook.test"}';
  const timestamp = String(Math.floor(Date.now() / 1000));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${rawBody}`));
  const signature = [...new Uint8Array(sigBuf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  const ok = await verifyGrowthDailyWebhook({ secret, rawBody, timestamp, signature });
  assert.equal(ok, true);
});

test("verifyGrowthDailyWebhook rejects stale timestamp", async () => {
  const ok = await verifyGrowthDailyWebhook({
    secret: "x",
    rawBody: "{}",
    timestamp: String(Math.floor(Date.now() / 1000) - 3600),
    signature: "00",
  });
  assert.equal(ok, false);
});

test("sanitizeArticleHtml drops h1 and javascript links", { skip: typeof HTMLRewriter === "undefined" }, async () => {
  const html = `<h1>Title</h1><p>Hello</p><a href="javascript:alert(1)">bad</a><script>alert(1)</script>`;
  const out = await sanitizeArticleHtml(html);
  assert.match(out, /<p>Hello<\/p>/);
  assert.doesNotMatch(out, /h1|script|javascript/i);
});
