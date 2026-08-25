import type { Locale } from "../i18n/config";

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

/** Official Apple badges, vendored under `/public/badges/app-store`. */
export function appStoreBadgeSrc(locale: Locale, variant: "black" | "white"): string {
  return `/badges/app-store/${locale}-${variant}.svg`;
}
