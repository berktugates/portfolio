import type { LicensedImage } from "@berktug/editorial-gates/image-license";

export {
  GUNDEM_FALLBACK_OG,
  isAllowedImageHost,
  validateLicensedImage,
  type ImageLicenseKind,
  type ImageLicenseResult,
  type LicensedImage,
} from "@berktug/editorial-gates/image-license";

const LICENSE_URLS: Record<LicensedImage["license"], string> = {
  pexels: "https://www.pexels.com/license/",
  unsplash: "https://unsplash.com/license",
  cc0: "https://creativecommons.org/publicdomain/zero/1.0/",
  "cc-by": "https://creativecommons.org/licenses/by/4.0/",
};

function pexelsPhotoPage(src: string): string | null {
  const match = src.match(/\/photos\/(\d+)\//);
  return match ? `https://www.pexels.com/photo/${match[1]}/` : null;
}

/** Google Images license metadata derived only from the verified image record. */
export function licensedImageJsonLd(image: LicensedImage) {
  const acquireLicensePage =
    image.license === "pexels" ? pexelsPhotoPage(image.src) ?? image.creditUrl : image.creditUrl;

  return {
    "@type": "ImageObject",
    contentUrl: image.src,
    url: image.src,
    caption: image.alt,
    license: LICENSE_URLS[image.license],
    acquireLicensePage,
    creditText: image.creditName,
    copyrightNotice: image.creditName,
  } as const;
}
