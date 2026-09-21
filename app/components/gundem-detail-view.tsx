import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getGundemBySlug, getGundemSlugs } from "../lib/gundem/catalog";
import { validateLicensedImage } from "../lib/image-license";
import { GUNDEM_DETAIL_ANALYSIS_NOTE, GUNDEM_HEADER_ROLE } from "../lib/gundem/editorial";
import { haberlerArticlePath, haberlerUrl } from "../lib/gundem/hosts";
import { AUTHOR_ID, SITE_NAME, jsonLd } from "../lib/seo";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export const revalidate = 1800;

export async function gundemStaticParams() {
  const slugs = await getGundemSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function createGundemDetailMetadata({ params }: Props): Promise<Metadata> {
  const briefing = await getGundemBySlug((await params).slug);
  if (!briefing) return {};
  const canonical = haberlerUrl(haberlerArticlePath(briefing.slug));
  return {
    title: briefing.title,
    description: briefing.excerpt,
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
      images: [{ url: briefing.image.src, alt: briefing.image.alt }],
    },
  };
}

export async function GundemDetailView({ params }: Props) {
  const slug = (await params).slug;
  const briefing = await getGundemBySlug(slug);
  if (!briefing) notFound();

  const imageCheck = validateLicensedImage(briefing.image);
  if (!imageCheck.ok) notFound();

  const canonical = haberlerUrl(haberlerArticlePath(briefing.slug));
  const paragraphs = briefing.bodyMarkdown.split(/\n\n+/).filter(Boolean);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Gündem", item: haberlerUrl("/") },
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
        image: {
          "@type": "ImageObject",
          url: briefing.image.src,
          caption: briefing.image.alt,
          creditText: briefing.image.creditName,
          creator: { "@type": "Person", name: briefing.image.creditName, url: briefing.image.creditUrl },
        },
      },
    ],
  };

  return (
    <div lang="tr" className="relative mx-auto min-h-screen w-full max-w-screen-sm px-4 pt-20">
      <SiteHeader
        homeHref={haberlerUrl("/")}
        name={SITE_NAME}
        role={GUNDEM_HEADER_ROLE}
        ariaLabel="Ana sayfa"
        imageAlt={SITE_NAME}
      />
      <main className="blog-prose mt-12 pb-20">
        <Link
          href={haberlerUrl("/")}
          className="mb-12 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
        >
          <ArrowLeft className="size-4" />
          Gündem
        </Link>
        <article>
          <header className="mb-10">
            <h1>{briefing.title}</h1>
            <p className="!my-0 text-sm text-zinc-500 dark:text-zinc-400">
              <time dateTime={briefing.publishedAt}>{briefing.publishedAt}</time>
            </p>
            <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">{briefing.excerpt}</p>
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">{GUNDEM_DETAIL_ANALYSIS_NOTE}</p>
          </header>
          <figure className="mb-10 overflow-hidden rounded-xl">
            <Image
              src={briefing.image.src}
              alt={briefing.image.alt}
              width={1200}
              height={630}
              className="h-auto w-full object-cover"
              unoptimized
            />
            <figcaption className="mt-2 text-xs text-zinc-500">
              Stok görsel — {briefing.image.creditName} (
              <a href={briefing.image.creditUrl} rel="noreferrer noopener" target="_blank">
                {briefing.image.license}
              </a>
              ). Olay fotoğrafı değildir.
            </figcaption>
          </figure>
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
          <hr />
          <h2>Kaynaklar</h2>
          <ul>
            {briefing.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} rel="noreferrer noopener" target="_blank">
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </div>
  );
}
