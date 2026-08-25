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

export function AppStoreBadge({ locale, href, title, label, ariaLabel }: AppStoreBadgeProps) {
  const storeUrl = localizeAppStoreUrl(href, locale);

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
        src={appStoreBadgeSrc(locale, "black")}
        alt={label}
        width={120}
        height={40}
        className="store-badge light-store-badge"
      />
      <img
        src={appStoreBadgeSrc(locale, "white")}
        alt={label}
        width={120}
        height={40}
        className="store-badge dark-store-badge"
      />
    </a>
  );
}
