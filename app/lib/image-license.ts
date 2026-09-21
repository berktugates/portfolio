export type ImageLicenseKind = "pexels" | "unsplash" | "cc0" | "cc-by";

export type LicensedImage = {
  src: string;
  alt: string;
  creditName: string;
  creditUrl: string;
  license: ImageLicenseKind;
  query: string;
};

const ALLOWED_HOSTS = new Set([
  "images.pexels.com",
  "www.pexels.com",
  "pexels.com",
  "images.unsplash.com",
  "unsplash.com",
  "upload.wikimedia.org",
]);

const BANNED_HOST_RE =
  /(?:^|\.)((?:aa|aa\.com\.tr)|reuters|gettyimages|shutterstock|hurriyet|milliyet|haberturk|cnnturk|ntv|sozcu|yenisafak|i\.hurimg|ogcdn|cdn\.trt|dailymail|theguardian\.com\/.*\/images)/i;

export function isAllowedImageHost(src: string): boolean {
  let host: string;
  try {
    host = new URL(src).hostname.toLowerCase();
  } catch {
    return false;
  }
  if (BANNED_HOST_RE.test(host)) return false;
  if (host === "upload.wikimedia.org") return true;
  return ALLOWED_HOSTS.has(host);
}

export type ImageLicenseResult =
  | { ok: true; image: LicensedImage }
  | { ok: false; code: string; reason: string };

export function validateLicensedImage(image: LicensedImage): ImageLicenseResult {
  if (!image.src.startsWith("https://")) {
    return { ok: false, code: "scheme", reason: "src must be https" };
  }
  if (!isAllowedImageHost(image.src)) {
    return { ok: false, code: "host", reason: image.src };
  }
  if (image.alt.length < 10 || image.alt.length > 160) {
    return { ok: false, code: "alt-length", reason: String(image.alt.length) };
  }
  const allowedLicenses: ImageLicenseKind[] = ["pexels", "unsplash", "cc0", "cc-by"];
  if (!allowedLicenses.includes(image.license)) {
    return { ok: false, code: "license", reason: image.license };
  }
  return { ok: true, image };
}

/** Site-owned fallback when stock search fails. */
export const GUNDEM_FALLBACK_OG = "/og-gundem-fallback.webp";
