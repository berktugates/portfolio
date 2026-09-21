import assert from "node:assert/strict";
import test from "node:test";
import { isAllowedImageHost, validateLicensedImage } from "./image-license";

test("rejects agency CDN host", () => {
  assert.equal(isAllowedImageHost("https://i.hurimg.com/example.jpg"), false);
});

test("accepts pexels host", () => {
  assert.equal(isAllowedImageHost("https://images.pexels.com/photos/1.jpeg"), true);
});

test("validates licensed image record", () => {
  const result = validateLicensedImage({
    src: "https://images.unsplash.com/photo-1",
    alt: "Server racks in a data center, stock photo not event journalism",
    creditName: "Jane Doe",
    creditUrl: "https://unsplash.com/@jane",
    license: "unsplash",
    query: "server rack",
  });
  assert.equal(result.ok, true);
});
