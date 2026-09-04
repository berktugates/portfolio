"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, isLocale } from "../lib/i18n";
import { SiteAssistantLauncher } from "./site-assistant";

function localeFromPathname(pathname: string) {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && isLocale(segment) && segment !== DEFAULT_LOCALE) {
    return segment;
  }
  return DEFAULT_LOCALE;
}

function hasEmbeddedAssistant(pathname: string) {
  const clean = pathname.replace(/\/$/, "") || "/";
  if (clean === "/" || clean === "/hire") return true;
  const parts = clean.split("/").filter(Boolean);
  if (parts.length === 1 && isLocale(parts[0]!)) return true;
  if (parts.length === 2 && isLocale(parts[0]!) && parts[1] === "hire") return true;
  return false;
}

export function SiteAssistantRoot() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname ?? "/");
  if (hasEmbeddedAssistant(pathname ?? "/")) {
    return null;
  }
  return <SiteAssistantLauncher locale={locale} />;
}
