"use client";

/* eslint-disable @next/next/no-img-element */
import {
  appStoreBadgeFallbackSrc,
  appStoreBadgeSrc,
  localizeAppStoreUrl,
} from "../lib/content/app-store";
import type { Locale } from "../lib/i18n";
import { formatMessage } from "../lib/i18n/format";

type AppStoreBadgeProps = {
  locale: Locale;
  href: string;
  title: string;
  /** Accessible label matching the localized badge. */
  label: string;
  /** Template with `{{title}}`. */
  ariaLabel: string;
};

/**
 * Official Apple App Store badge for the active site locale.
 *
 * Artwork comes from Apple App Store Marketing Tools (Marketing Guidelines).
 * We never draw or restyle the badge; black is Apple’s preferred variant,
 * white is the approved alternative for dark backgrounds.
 *
 * @see https://developer.apple.com/app-store/marketing/guidelines/
 * @see https://toolbox.marketingtools.apple.com/
 */
export function AppStoreBadge({ locale, href, title, label, ariaLabel }: AppStoreBadgeProps) {
  const storeUrl = localizeAppStoreUrl(href, locale);
  const blackSrc = appStoreBadgeSrc(locale, "black");
  const whiteSrc = appStoreBadgeSrc(locale, "white");
  const blackFallback = appStoreBadgeFallbackSrc(locale, "black");
  const whiteFallback = appStoreBadgeFallbackSrc(locale, "white");

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
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = blackFallback;
        }}
      />
      <img
        key={whiteSrc}
        src={whiteSrc}
        alt={label}
        height={40}
        className="store-badge dark-store-badge"
        decoding="async"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = whiteFallback;
        }}
      />
    </a>
  );
}
