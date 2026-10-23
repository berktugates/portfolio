import assert from "node:assert/strict";
import test from "node:test";
import { contentGroupForPath } from "./content-group";

test("contentGroupForPath maps sections", () => {
  assert.equal(contentGroupForPath("/blogs/my-post"), "blog");
  assert.equal(contentGroupForPath("/tr/blogs"), "blog");
  assert.equal(contentGroupForPath("/hire/web"), "hire");
  assert.equal(contentGroupForPath("/de/hire"), "hire");
  assert.equal(contentGroupForPath("/gundem/x"), "gundem");
  assert.equal(contentGroupForPath("/", "haberler.berktugberke.com"), "gundem");
  assert.equal(contentGroupForPath("/"), "other");
  assert.equal(contentGroupForPath("/projects/foo"), "other");
  assert.equal(contentGroupForPath("/contact"), "other");
});
