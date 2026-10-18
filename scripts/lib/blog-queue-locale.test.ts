import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test("versioning TR overlay bullets are localized", () => {
  const path = resolve(import.meta.dirname, "../../app/content/blogs-tr.ts");
  const source = readFileSync(path, "utf8");
  assert.ok(!source.includes('"Publish a mobile compatibility matrix'));
  assert.ok(source.includes("API epoch başına minimum uygulama sürümü"));
});
