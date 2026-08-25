import { SITE_URL, absoluteUrl } from "../seo";

export const LOCALES = ["en", "tr", "de", "fr", "it", "zh", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const PREFERRED_LOCALE_KEY = "preferred-locale";
export const LOCALE_BOOT_KEY = "locale-bootstrapped";

export const localeMeta: Record<
  Locale,
  {
    path: string;
    htmlLang: string;
    hreflang: string;
    ogLocale: string;
    nativeName: string;
    dir: "ltr" | "rtl";
  }
> = {
  en: { path: "/", htmlLang: "en", hreflang: "en", ogLocale: "en_US", nativeName: "English", dir: "ltr" },
  tr: { path: "/tr", htmlLang: "tr", hreflang: "tr", ogLocale: "tr_TR", nativeName: "Türkçe", dir: "ltr" },
  de: { path: "/de", htmlLang: "de", hreflang: "de", ogLocale: "de_DE", nativeName: "Deutsch", dir: "ltr" },
  fr: { path: "/fr", htmlLang: "fr", hreflang: "fr", ogLocale: "fr_FR", nativeName: "Français", dir: "ltr" },
  it: { path: "/it", htmlLang: "it", hreflang: "it", ogLocale: "it_IT", nativeName: "Italiano", dir: "ltr" },
  zh: { path: "/zh", htmlLang: "zh-Hans", hreflang: "zh-Hans", ogLocale: "zh_CN", nativeName: "中文", dir: "ltr" },
  ja: { path: "/ja", htmlLang: "ja", hreflang: "ja", ogLocale: "ja_JP", nativeName: "日本語", dir: "ltr" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localePath(locale: Locale) {
  return localeMeta[locale].path;
}

export function localeUrl(locale: Locale) {
  return absoluteUrl(localePath(locale));
}

export function hreflangLanguages() {
  const languages: Record<string, string> = { "x-default": SITE_URL };
  for (const locale of LOCALES) {
    languages[localeMeta[locale].hreflang] = localeUrl(locale);
  }
  return languages;
}

export function matchLocale(tags: readonly string[]): Locale {
  for (const raw of tags) {
    const tag = raw.trim().toLowerCase();
    if (!tag) continue;
    if (tag.startsWith("zh")) return "zh";
    const base = tag.split("-")[0] ?? tag;
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

/**
 * One-time device-language bootstrap for `/` only.
 * Never re-runs after first decision; English is fallback.
 */
export const LOCALE_REDIRECT_SCRIPT = `(function(){try{var path=location.pathname.replace(/\\/$/,"")||"/";if(path!=="/")return;var PREF=${JSON.stringify(PREFERRED_LOCALE_KEY)};var BOOT=${JSON.stringify(LOCALE_BOOT_KEY)};if(localStorage.getItem(BOOT)){var saved=localStorage.getItem(PREF);if(saved&&saved!=="en"&&{tr:1,de:1,fr:1,it:1,zh:1,ja:1}[saved])location.replace("/"+saved+location.search+location.hash);return}var supported={en:1,tr:1,de:1,fr:1,it:1,zh:1,ja:1};function match(tag){tag=String(tag||"").toLowerCase();if(!tag)return null;if(tag.indexOf("zh")===0)return"zh";var base=tag.split("-")[0];return supported[base]?base:null}var chosen="en";var list=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language];for(var i=0;i<list.length;i++){var m=match(list[i]);if(m){chosen=m;break}}localStorage.setItem(BOOT,"1");localStorage.setItem(PREF,chosen);if(chosen!=="en")location.replace("/"+chosen+location.search+location.hash)}catch(e){}})();`;
