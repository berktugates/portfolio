import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GundemCover, gundemShowsPhoto } from "./gundem-cover";
import { HaberlerShell } from "./haberler-shell";
import { getGundemBySlug, getGundemSlugs } from "../lib/gundem/catalog";
import { briefingHighlights } from "../lib/gundem/briefing-highlights";
import { validateLicensedImage } from "../lib/image-license";
import { HABERLER_PAGE_TITLE, formatGundemCategory, formatGundemDate } from "../lib/gundem/editorial";
import { haberlerArticlePath, haberlerUrl } from "../lib/gundem/hosts";
import { getDictionary } from "../lib/i18n";
import { AUTHOR_ID, SITE_URL, visibleAuthorMeta, jsonLd } from "../lib/seo";
import { SiteFooter } from "./site-footer";

export const revalidate = 1800;

export async function gundemStaticParams() {
  const slugs = await getGundemSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function createGundemDetailMetadata({ params }: Props): Promise<Metadata> {
  const [briefing, dict] = await Promise.all([
    getGundemBySlug((await params).slug),
    getDictionary("tr"),
  ]);
  if (!briefing) return {};
  const canonical = haberlerUrl(haberlerArticlePath(briefing.slug));
  return {
    title: briefing.title,
    description: briefing.excerpt,
    ...visibleAuthorMeta(dict.headerName),
    alternates: { canonical },
    metadataBase: new URL(haberlerUrl("/")),
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      locale: "tr_TR",
      title: briefing.title,
      description: briefing.excerpt,
      url: canonical,
      publishedTime: briefing.publishedAt,
      modifiedTime: briefing.dateModified,
      ...(gundemShowsPhoto(briefing)
        ? { images: [{ url: briefing.image.src, alt: briefing.image.alt }] }
        : {}),
    },
  };
}

export async function GundemDetailView({ params }: Props) {
  const slug = (await params).slug;
  const [briefing, dict] = await Promise.all([getGundemBySlug(slug), getDictionary("tr")]);
  if (!briefing) notFound();

  const imageCheck = validateLicensedImage(briefing.image);
  if (!imageCheck.ok && imageCheck.code !== "disclaimer-alt") notFound();

  const canonical = haberlerUrl(haberlerArticlePath(briefing.slug));
  const paragraphs = briefing.bodyMarkdown.split(/\n\n+/).filter(Boolean);
  const highlights = briefingHighlights(briefing.bodyMarkdown, 4);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: HABERLER_PAGE_TITLE, item: haberlerUrl("/") },
          { "@type": "ListItem", position: 2, name: briefing.title, item: canonical },
        ],
      },
      {
        "@type": "NewsArticle",
        headline: briefing.title,
        description: briefing.excerpt,
        datePublished: briefing.publishedAt,
        dateModified: briefing.dateModified,
        inLanguage: "tr-TR",
        mainEntityOfPage: canonical,
        author: { "@id": AUTHOR_ID },
        citation: briefing.sources.map((s) => s.url),
        ...(gundemShowsPhoto(briefing)
          ? {
              image: {
                "@type": "ImageObject",
                url: briefing.image.src.startsWith("http") ? briefing.image.src : `${SITE_URL}${briefing.image.src}`,
                caption: briefing.image.alt,
              },
            }
          : {}),
      },
    ],
  };

  return (
    <HaberlerShell activeCategory={briefing.category ?? null}>
      <main className="blog-prose mx-auto max-w-3xl pb-12">
        <article>
          <header className="mb-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
              <Link
                href={haberlerUrl(briefing.category ? `/kategori/${briefing.category}` : "/")}
                className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {formatGundemCategory(briefing.category)}
              </Link>
              {briefing.trendQuery ? (
                <span className="rounded-full border border-zinc-200 px-2.5 py-1 dark:border-zinc-700">
                  Gündem: {briefing.trendQuery}
                </span>
              ) : null}
              <time dateTime={briefing.publishedAt}>{formatGundemDate(briefing.publishedAt)}</time>
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{briefing.title}</h1>
            <p className="!my-0 mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">{briefing.excerpt}</p>
          </header>

          <figure className="mb-10 overflow-hidden rounded-xl">
            <GundemCover post={briefing} priority />
          </figure>

          {highlights.length > 0 ? (
            <aside className="not-prose mb-10 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Okur özeti</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
                {highlights.map((line) => (
                  <li key={line.slice(0, 48)} className="flex gap-2">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-zinc-400" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}

          <div className="max-w-none">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
            <h2 className="text-base font-medium">Kaynaklar</h2>
            <ul className="text-sm text-zinc-600 dark:text-zinc-400">
              {briefing.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} rel="noreferrer noopener" target="_blank">
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
            <aside className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <p className="font-medium text-zinc-950 dark:text-zinc-50">{dict.headerName}</p>
              <p className="text-sm text-zinc-500">Editör</p>
              <a href={SITE_URL} className="text-sm text-zinc-700 underline dark:text-zinc-300">
                berktugberke.com
              </a>
            </aside>
          </div>
        </article>
      </main>
      <SiteFooter name={dict.headerName} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </HaberlerShell>
  );
}
