/* eslint-disable @next/next/no-img-element */
import { appStoreBadgeSrc, localizeAppStoreUrl } from "../lib/content/app-store";
import type { Locale } from "../lib/i18n";
import { formatMessage } from "../lib/i18n/format";

type AppStoreBadgeProps = {
  locale: Locale;
  href: string;
  title: string;
  /** Visible/alt label, e.g. "Download on the App Store". */
  label: string;
  /** Template with `{{title}}`, e.g. "Download {{title}} on the App Store". */
  ariaLabel: string;
};

/**
 * Official Apple App Store badge for the active locale.
 * Uses vendored PNG artwork (not the US-only developer.apple.com SVG).
 */
export function AppStoreBadge({ locale, href, title, label, ariaLabel }: AppStoreBadgeProps) {
  const storeUrl = localizeAppStoreUrl(href, locale);
  const blackSrc = appStoreBadgeSrc(locale, "black");
  const whiteSrc = appStoreBadgeSrc(locale, "white");

  return (
    <a
      href={storeUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={formatMessage(ariaLabel, { title })}
      className="store-badge-link"
      hrefLang={locale === "zh" ? "zh-Hans" : locale}
    >
      <img
        key={blackSrc}
        src={blackSrc}
        alt={label}
        height={40}
        className="store-badge light-store-badge"
        decoding="async"
      />
      <img
        key={whiteSrc}
        src={whiteSrc}
        alt={label}
        height={40}
        className="store-badge dark-store-badge"
        decoding="async"
      />
    </a>
  );
}
