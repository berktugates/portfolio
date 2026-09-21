#!/usr/bin/env node
/**
 * POST canonical URLs to IndexNow after publish.
 * Env: INDEXNOW_KEY, SITE_HOST (default berktugberke.com)
 */
const key = process.env.INDEXNOW_KEY;
const host = process.env.HABERLER_HOST ?? process.env.SITE_HOST ?? "haberler.berktugberke.com";
const urls = process.argv.slice(2).filter((arg) => arg.startsWith("https://"));

if (!key) {
  console.log("INDEXNOW_KEY not set; skipping IndexNow.");
  process.exit(0);
}

if (urls.length === 0) {
  console.error("Usage: node scripts/indexnow-submit.mjs https://host/path ...");
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls }),
});

console.log(`IndexNow status: ${res.status}`);
if (!res.ok && res.status !== 202) process.exit(1);
