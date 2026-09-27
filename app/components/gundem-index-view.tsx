import type { Metadata } from "next";
import Link from "next/link";
import { GundemCover } from "./gundem-cover";
import { GundemHeroCarousel } from "./gundem-hero-carousel";
import { HaberlerShell } from "./haberler-shell";
import { SiteFooter } from "./site-footer";
import { getAllGundemBriefings } from "../lib/gundem/catalog";
import {
  GUNDEM_INDEX_LEDE,
  GUNDEM_META_DESCRIPTION,
  HABERLER_PAGE_TITLE,
  formatGundemCategory,
  formatGundemDate,
  type GundemCategory,
} from "../lib/gundem/editorial";
import { haberlerArticlePath, haberlerUrl } from "../lib/gundem/hosts";
import { formatGundemViewCount, getGundemViewCountsForPosts } from "../lib/gundem/view-counts";
import { getDictionary } from "../lib/i18n";
import { visibleAuthorMeta } from "../lib/seo";
import type { GundemBriefing } from "../lib/gundem/types";

export const revalidate = 1800;

export async function createGundemIndexMetadata(activeCategory?: GundemCategory | null): Promise<Metadata> {
  const dict = await getDictionary("tr");
  const categoryLabel = activeCategory ? formatGundemCategory(activeCategory) : null;
  const title = categoryLabel ? `${categoryLabel} — ${HABERLER_PAGE_TITLE}` : HABERLER_PAGE_TITLE;
  const description = categoryLabel
    ? `${categoryLabel} gündemi: ${GUNDEM_META_DESCRIPTION}`
    : GUNDEM_META_DESCRIPTION;
  const canonicalPath = activeCategory ? `/kategori/${activeCategory}` : "/";
  return {
    title,
    description,
    ...visibleAuthorMeta(dict.headerName),
    alternates: { canonical: haberlerUrl(canonicalPath) },
    metadataBase: new URL(haberlerUrl("/")),
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      title,
      description,
      url: haberlerUrl(canonicalPath),
    },
  };
}

function todayIstanbulIsoDate(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
}

function HaberGridCard({
  post,
  viewCount,
  priority = false,
}: {
  post: GundemBriefing;
  viewCount: number;
  priority?: boolean;
}) {
  return (
    <Link
      href={haberlerUrl(haberlerArticlePath(post.slug))}
      data-gundem-card="grid"
      className="group block h-full overflow-hidden rounded-2xl bg-zinc-300/30 p-px transition-[background] duration-200 dark:bg-zinc-600/30"
    >
      <span className="flex h-full flex-col overflow-hidden rounded-[15px] bg-white dark:bg-zinc-950 sm:min-h-[10.5rem] sm:flex-row sm:items-stretch">
        <span className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-zinc-100 sm:aspect-auto sm:w-40 sm:min-h-[10.5rem] md:w-44 dark:bg-zinc-900">
          <GundemCover post={post} priority={priority} fill />
        </span>
        <span className="flex min-w-0 flex-1 flex-col p-4 sm:py-3.5">
          <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
            <span>{formatGundemCategory(post.category)}</span>
            {post.trendQuery ? (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                #{post.trendQuery}
              </span>
            ) : null}
          </span>
          <span className="mt-2 line-clamp-2 block text-base font-semibold leading-snug text-zinc-950 dark:text-zinc-50">
            {post.title}
          </span>
          <span className="mt-1.5 line-clamp-2 block text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {post.excerpt}
          </span>
          <span className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-xs text-zinc-500">
            <time dateTime={post.publishedAt}>{formatGundemDate(post.publishedAt)}</time>
            <span aria-label={`${formatGundemViewCount(viewCount)} okuma`}>
              {formatGundemViewCount(viewCount)} okuma
            </span>
          </span>
        </span>
      </span>
    </Link>
  );
}

type GundemIndexViewProps = {
  activeCategory?: GundemCategory | null;
};

export async function GundemIndexView({ activeCategory = null }: GundemIndexViewProps) {
  const [allPosts, dict] = await Promise.all([getAllGundemBriefings(), getDictionary("tr")]);
  const posts = activeCategory
    ? allPosts.filter((p) => (p.category ?? "diger") === activeCategory)
    : allPosts;
  const viewCounts = await getGundemViewCountsForPosts(posts);
  const carouselPosts = [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 5);
  const popularPosts = [...posts].sort(
    (a, b) => (viewCounts[b.slug] ?? 0) - (viewCounts[a.slug] ?? 0),
  );
  const trendingTopics = [...new Set(allPosts.map((p) => p.trendQuery).filter(Boolean))].slice(0, 8);
  const todayLabel = formatGundemDate(todayIstanbulIsoDate());
  const categoryTitle = activeCategory ? formatGundemCategory(activeCategory) : null;

  return (
    <HaberlerShell activeCategory={activeCategory}>
      <div className="mb-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">{todayLabel}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
          {categoryTitle ?? HABERLER_PAGE_TITLE}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-300">{GUNDEM_INDEX_LEDE}</p>
        {trendingTopics.length > 0 ? (
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Bugün konuşulanlar</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {trendingTopics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <main className="space-y-10">
        {carouselPosts.length > 0 ? (
          <GundemHeroCarousel posts={carouselPosts} />
        ) : null}

        {popularPosts.length > 0 ? (
          <section aria-labelledby="gundem-grid-heading">
            <h2
              id="gundem-grid-heading"
              className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500"
            >
              {categoryTitle ? `${categoryTitle} — en çok okunanlar` : "En çok okunanlar"}
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {popularPosts.map((post, index) => (
                <HaberGridCard
                  key={post.slug}
                  post={post}
                  viewCount={viewCounts[post.slug] ?? 0}
                  priority={index < 2}
                />
              ))}
            </div>
          </section>
        ) : null}

        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {categoryTitle
              ? `${categoryTitle} için henüz brifing yok. Kısa süre içinde yeni başlıklar eklenecek.`
              : "Brifingler hazırlanıyor. Gündem başlıkları kısa süre içinde burada listelenecek."}
          </p>
        ) : null}
      </main>

      <SiteFooter name={dict.headerName} />
    </HaberlerShell>
  );
}
