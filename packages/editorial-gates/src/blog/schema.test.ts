import assert from "node:assert/strict";
import test from "node:test";
import { validateBlogPostDraft } from "./schema";

test("valid blog draft passes schema", () => {
  assert.equal(
    validateBlogPostDraft({
      slug: "api-versioning-for-mobile",
      title: "API versioning for mobile clients",
      excerpt: "Mobile apps ship on cadences that do not match your backend deploys.",
      description: "How to version public APIs used by mobile clients without breaking offline-first apps.",
      keywords: ["api", "mobile", "versioning"],
      sections: [
        {
          heading: "Why mobile needs explicit versions",
          paragraphs: [
            "Mobile binaries cannot assume the server they talked to yesterday is identical today.",
          ],
        },
        {
          heading: "Contract tests at the boundary",
          paragraphs: [
            "Golden fixtures per app version catch accidental field removals before rollout.",
          ],
        },
        {
          heading: "Rollout discipline",
          paragraphs: [
            "Sunset headers and minimum app version gates beat silent 500s in production.",
          ],
        },
      ],
    }),
    true,
  );
});

test("invalid slug fails schema", () => {
  assert.equal(
    validateBlogPostDraft({
      slug: "Bad Slug!",
      title: "x",
      excerpt: "x",
      description: "x",
      keywords: [],
      sections: [],
    }),
    false,
  );
});
