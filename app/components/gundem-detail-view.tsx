import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GundemCover } from "./gundem-cover";
import { HaberlerShell } from "./haberler-shell";
import { getGundemBySlug, getGundemSlugs } from "../lib/gundem/catalog";
import { briefingHighlights } from "../lib/gundem/briefing-highlights";
import { validateLicensedImage } from "../lib/image-license";
import { HABERLER_PAGE_TITLE, formatGundemCategory, formatGundemDate } from "../lib/gundem/editorial";
import { haberlerArticlePath, haberlerUrl } from "../lib/gundem/hosts";
import { getDictionary } from "../lib/i18n";
import { AUTHOR_ID, SITE_URL, visibleAuthorMeta, jsonLd } from "../lib/seo";
import { GundemDetailChatDock } from "./gundem-detail-chat-dock";
import { GundemViewBeacon } from "./gundem-view-beacon";
import { SiteFooter } from "./site-footer";
import { newsPublisherJsonLd } from "../lib/gundem/publication";
import { BlogShare } from "./blog-share";

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
    robots: { index: briefing.status !== "RETRACTED", follow: briefing.status !== "RETRACTED" },
    openGraph: {
      type: "article",
      locale: "tr_TR",
      title: briefing.title,
      description: briefing.excerpt,
      url: canonical,
      publishedTime: briefing.publishedAt,
      modifiedTime: briefing.dateModified,
      ...(validateLicensedImage(briefing.image).ok
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
  const chatSnippets = briefingHighlights(briefing.bodyMarkdown, 3);

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
        author: { "@type": "Person", "@id": AUTHOR_ID, name: dict.headerName, url: haberlerUrl("/yazar/berktug-berke-ates") },
        publisher: { "@id": "https://haberler.berktugberke.com/#publisher" },
        articleSection: formatGundemCategory(briefing.category),
        isAccessibleForFree: true,
        citation: briefing.sources.map((s) => s.url),
        ...(imageCheck.ok
          ? {
              image: {
                "@type": "ImageObject",
                url: briefing.image.src.startsWith("http") ? briefing.image.src : `${SITE_URL}${briefing.image.src}`,
                caption: briefing.image.alt,
              },
            }
          : {}),
      },
      newsPublisherJsonLd(),
    ],
  };

  return (
    <HaberlerShell activeCategory={briefing.category ?? null}>
      <GundemViewBeacon slug={briefing.slug} />
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
              <span>Yayımlandı: <time dateTime={briefing.publishedAt}>{formatGundemDate(briefing.publishedAt)}</time></span>
              {briefing.dateModified !== briefing.publishedAt ? (
                <span>Güncellendi: <time dateTime={briefing.dateModified}>{formatGundemDate(briefing.dateModified)}</time></span>
              ) : null}
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{briefing.title}</h1>
            <p className="!my-0 mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">{briefing.excerpt}</p>
          </header>

          <figure className="mb-10 overflow-hidden rounded-xl">
            <GundemCover post={briefing} priority forcePhoto />
          </figure>

          <div className="max-w-none">
            {briefing.status === "RETRACTED" ? (
              <p className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                Bu haber geri çekilmiştir. Aşağıdaki düzeltme geçmişi kaydın nedenini açıklar.
              </p>
            ) : null}
            {briefing.correctionNotice ? (
              <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
                <strong>Düzeltme:</strong> {briefing.correctionNotice}
              </p>
            ) : null}
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
                  {source.sourceType ? ` · ${source.sourceType === "official" ? "Resmî kaynak" : "Medya kaynağı"}` : null}
                </li>
              ))}
            </ul>
            <BlogShare title={briefing.title} url={canonical} label="Paylaş" />
            {briefing.revisions?.length ? (
              <section aria-labelledby="revision-history">
                <h2 id="revision-history" className="text-base font-medium">Güncelleme ve düzeltme geçmişi</h2>
                <ol className="text-sm text-zinc-600 dark:text-zinc-400">
                  {briefing.revisions.map((revision) => (
                    <li key={revision.revisionId}>
                      <time dateTime={revision.createdAt}>{formatGundemDate(revision.createdAt)}</time>
                      {` · ${revision.kind === "publish" ? "İlk yayın" : revision.kind === "update" ? "Güncelleme" : revision.kind === "correction" ? "Düzeltme" : "Geri çekme"}`}
                      {revision.note ? ` — ${revision.note}` : null}
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
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
      <GundemDetailChatDock title={briefing.title} excerpt={briefing.excerpt} snippets={chatSnippets} />
      <SiteFooter name={dict.headerName}>
        <Link href={haberlerUrl("/kunye")} className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Künye</Link>
        <Link href={haberlerUrl("/editorial-policy")} className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Editöryal politika</Link>
        <Link href={haberlerUrl("/duzeltme-talebi")} className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Düzeltme</Link>
      </SiteFooter>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </HaberlerShell>
  );
}
