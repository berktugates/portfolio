"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, isLocale } from "../lib/i18n";
import { SiteAssistantDock } from "./site-assistant";
import { SiteAssistantSidebar } from "./site-assistant-sidebar";

function localeFromPathname(pathname: string) {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && isLocale(segment) && segment !== DEFAULT_LOCALE) {
    return segment;
  }
  return DEFAULT_LOCALE;
}

function isBlogPage(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  // Check for /blogs or /{locale}/blogs
  if (segments[0] === "blogs") return true;
  if (segments.length >= 2 && isLocale(segments[0]) && segments[1] === "blogs") return true;
  return false;
}

export function SiteAssistantRoot() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname ?? "/");
  const isBlog = isBlogPage(pathname ?? "/");

  if (isBlog) {
    return <SiteAssistantSidebar locale={locale} />;
  }

  return <SiteAssistantDock locale={locale} />;
}
