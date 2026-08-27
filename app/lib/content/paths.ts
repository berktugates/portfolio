import {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  isLocale,
  localePath,
} from "../i18n/config";

/** Strip a leading `/{locale}` segment when present. */
export function stripLocalePrefix(pathname: string): string {
  const clean = pathname.replace(/\/$/, "") || "/";
  const parts = clean.split("/");
  const maybeLocale = parts[1];
  if (maybeLocale && isLocale(maybeLocale) && maybeLocale !== DEFAULT_LOCALE) {
    const rest = parts.slice(2).join("/");
    return rest ? `/${rest}` : "/";
  }
  return clean === "" ? "/" : clean;
}

export function withLocalePath(locale: Locale, pathname: string): string {
  const base = stripLocalePrefix(pathname);
  if (locale === DEFAULT_LOCALE) return base;
  if (base === "/") return localePath(locale);
  return `${localePath(locale)}${base}`;
}

export function blogsIndexPath(locale: Locale, page = 1): string {
  if (page <= 1) return withLocalePath(locale, "/blogs");
  return withLocalePath(locale, `/blogs/pages/${page}`);
}

export function blogPostPath(locale: Locale, slug: string): string {
  return withLocalePath(locale, `/blogs/${slug}`);
}

export function projectPath(locale: Locale, slug: string): string {
  return withLocalePath(locale, `/projects/${slug}`);
}

export type ProjectLegalDocument = "privacy" | "terms";

export function projectLegalPath(
  locale: Locale,
  slug: string,
  document: ProjectLegalDocument,
): string {
  return withLocalePath(locale, `/projects/${slug}/${document}`);
}

export function contentLocales(): Locale[] {
  return [...LOCALES];
}
