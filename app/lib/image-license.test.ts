import assert from "node:assert/strict";
import test from "node:test";
import { isAllowedImageHost, licensedImageJsonLd, validateLicensedImage } from "./image-license";

test("rejects agency CDN host", () => {
  assert.equal(isAllowedImageHost("https://i.hurimg.com/example.jpg"), false);
});

test("accepts pexels host", () => {
  assert.equal(isAllowedImageHost("https://images.pexels.com/photos/1.jpeg"), true);
});

test("rejects stock disclaimer in alt text", () => {
  const result = validateLicensedImage({
    src: "https://images.pexels.com/photos/1.jpeg",
    alt: "Şehir silüeti, stok görsel, olay fotoğrafı değil",
    creditName: "Pexels",
    creditUrl: "https://www.pexels.com",
    license: "pexels",
    query: "city",
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, "disclaimer-alt");
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

test("builds complete Google image license metadata for Pexels", () => {
  const metadata = licensedImageJsonLd({
    src: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress",
    alt: "Futbol topu ve stadyum sahası",
    creditName: "Pexels",
    creditUrl: "https://www.pexels.com",
    license: "pexels",
    query: "football",
  });

  assert.equal(metadata.contentUrl.includes("/photos/46798/"), true);
  assert.equal(metadata.license, "https://www.pexels.com/license/");
  assert.equal(metadata.acquireLicensePage, "https://www.pexels.com/photo/46798/");
  assert.equal(metadata.creditText, "Pexels");
  assert.equal(metadata.copyrightNotice, "Pexels");
});
