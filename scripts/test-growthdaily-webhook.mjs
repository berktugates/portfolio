#!/usr/bin/env node
/**
 * Local HMAC test against deployed Worker (no GrowthDailySEO UI required).
 * Usage:
 *   GROWTHDAILY_WEBHOOK_SECRET=... node scripts/test-growthdaily-webhook.mjs
 */
import { createHmac } from "node:crypto";

const secret = process.env.GROWTHDAILY_WEBHOOK_SECRET;
const base =
  process.env.CONTENT_PUBLISHER_URL?.replace(/\/$/, "") ??
  "https://berktug-content-publisher.berktugates.workers.dev";

if (!secret) {
  console.error("Set GROWTHDAILY_WEBHOOK_SECRET");
  process.exit(1);
}

const rawBody = JSON.stringify({ event: "webhook.test", slug: "test-slug" });
const timestamp = String(Math.floor(Date.now() / 1000));
const signature = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");

const res = await fetch(`${base}/webhooks/growthdaily`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-growthdaily-timestamp": timestamp,
    "x-growthdaily-signature": signature,
  },
  body: rawBody,
});

console.log("status", res.status);
console.log(await res.text());
