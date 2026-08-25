import type { Locale } from "../i18n/config";

/**
 * Official App Store badge + storefront helpers.
 * Artwork: Apple App Store Marketing Tools / Marketing Guidelines
 * https://developer.apple.com/app-store/marketing/guidelines/
 * https://toolbox.marketingtools.apple.com/
 *
 * Do not invent badge artwork. Always use Apple-provided localized badges.
 * Note: Apple keeps the “App Store” service mark in English; only the
 * “Download on the …” line is localized.
 */

/** App Store storefront country codes used in `apps.apple.com/{cc}/app/...`. */
export const APP_STORE_STOREFRONT: Record<Locale, string> = {
  en: "us",
  tr: "tr",
  de: "de",
  fr: "fr",
  it: "it",
  zh: "cn",
  ja: "jp",
};

/** Apple Marketing Tools badge language tags (official artwork API). */
export const APP_STORE_BADGE_LANG: Record<Locale, string> = {
  en: "en-us",
  tr: "tr-tr",
  de: "de-de",
  fr: "fr-fr",
  it: "it-it",
  zh: "zh-cn",
  ja: "ja-jp",
};

/**
 * Rewrite an App Store product URL to the storefront for `locale`.
 * Safe no-op for non–apps.apple.com URLs.
 */
export function localizeAppStoreUrl(url: string, locale: Locale): string {
  const country = APP_STORE_STOREFRONT[locale];
  try {
    const parsed = new URL(url);
    if (!/(^|\.)apps\.apple\.com$/i.test(parsed.hostname)) return url;

    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return url;

    if (parts[0] === "app") {
      parsed.pathname = `/${country}/${parts.join("/")}`;
      return parsed.toString();
    }

    if (parts[1] === "app") {
      parts[0] = country;
      parsed.pathname = `/${parts.join("/")}`;
      return parsed.toString();
    }

    return url;
  } catch {
    return url;
  }
}

/**
 * Official Apple “Download on the App Store” badge SVG from Marketing Tools.
 * Preferred black badge for light UI; white alternative for dark UI.
 */
export function appStoreBadgeSrc(locale: Locale, variant: "black" | "white"): string {
  const lang = APP_STORE_BADGE_LANG[locale];
  return `https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/${variant}/${lang}?size=250x83`;
}

/** Local mirror of the same official Apple SVGs (offline / CSP fallback). */
export function appStoreBadgeFallbackSrc(locale: Locale, variant: "black" | "white"): string {
  return `/badges/app-store/${locale}-${variant}.svg`;
}
