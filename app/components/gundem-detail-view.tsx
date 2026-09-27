import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { GundemCover, gundemShowsPhoto } from "./gundem-cover";
import { getGundemBySlug, getGundemSlugs } from "../lib/gundem/catalog";
import { validateLicensedImage } from "../lib/image-license";
import { GUNDEM_DETAIL_ANALYSIS_NOTE, HABERLER_PAGE_TITLE, formatGundemCategory, formatGundemDate } from "../lib/gundem/editorial";
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
    <div lang="tr" className="flex min-h-screen w-full flex-col">
      <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
        <main className="blog-prose pb-20">
          <Link
            href={haberlerUrl("/")}
            className="mb-10 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="size-4" />
            {HABERLER_PAGE_TITLE}
          </Link>
        <article>
          <header className="mb-8">
            <p className="text-xs font-medium text-zinc-500">{formatGundemCategory(briefing.category)}</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              <time dateTime={briefing.publishedAt}>{formatGundemDate(briefing.publishedAt)}</time>
            </p>
            <h1 className="mt-4">{briefing.title}</h1>
            <p className="!my-0 mt-4 max-w-[40rem] text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {briefing.excerpt}
            </p>
          </header>
          <figure className="mb-10 overflow-hidden rounded-xl">
            <GundemCover post={briefing} priority />
            {gundemShowsPhoto(briefing) ? (
              <figcaption className="mt-2 text-xs text-zinc-500">
                {briefing.image.creditName} ({briefing.image.license})
              </figcaption>
            ) : null}
          </figure>
          <div className="max-w-[40rem]">
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
            <p className="text-sm text-zinc-500">{GUNDEM_DETAIL_ANALYSIS_NOTE}</p>
            <aside className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <p className="font-medium text-zinc-950 dark:text-zinc-50">{dict.headerName}</p>
              <p className="text-sm text-zinc-500">Yazılım mühendisi</p>
              <a href={SITE_URL} className="text-sm text-zinc-700 underline dark:text-zinc-300">
                berktugberke.com
              </a>
            </aside>
          </div>
        </article>
        </main>
        <SiteFooter name={dict.headerName} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </div>
  );
}
