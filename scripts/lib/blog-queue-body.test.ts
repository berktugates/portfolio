import { test } from "node:test";
import assert from "node:assert/strict";
import { assessContentSafety } from "../../app/lib/content-safety";
import { extractBlogQueuePlainText } from "./blog-queue-body";

test("extractBlogQueuePlainText avoids JSON quote false positives", () => {
  const raw = {
    title: "Test post title for safety gate",
    excerpt: "Short excerpt.",
    sections: [{ heading: "H", paragraphs: ["Word ".repeat(400)] }],
    locales: { tr: { sections: [{ paragraphs: ["extra ".repeat(50)] }] } },
  };
  const body = extractBlogQueuePlainText(raw);
  assert.ok(!body.startsWith("{"));
  const safety = assessContentSafety({ title: raw.title, body, excerpt: raw.excerpt });
  assert.equal(safety.ok, true);
});
