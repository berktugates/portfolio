/** English card for every locale except Turkish. One generated Turkish card, not seven hand-drawn files. */
export function shareImagePath(locale: string) {
  return locale === "tr" ? "/tr/opengraph-image" : "/opengraph-image";
}

export function shareImageMeta(locale: string, alt: string) {
  const url = shareImagePath(locale);
  return {
    openGraph: [{ url, width: 1200, height: 630, alt }],
    twitter: [url],
  };
}
