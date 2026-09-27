import type { Metadata } from "next";
import Link from "next/link";
import { GundemCover } from "./gundem-cover";
import { getAllGundemBriefings } from "../lib/gundem/catalog";
import {
  GUNDEM_META_DESCRIPTION,
  HABERLER_PAGE_TITLE,
  formatGundemCategory,
  formatGundemDate,
} from "../lib/gundem/editorial";
import { haberlerArticlePath, haberlerUrl } from "../lib/gundem/hosts";
import { getDictionary } from "../lib/i18n";
import { visibleAuthorMeta } from "../lib/seo";
import { SiteFooter } from "./site-footer";

export const revalidate = 1800;

export async function createGundemIndexMetadata(): Promise<Metadata> {
  const dict = await getDictionary("tr");
  const title = HABERLER_PAGE_TITLE;
  const description = GUNDEM_META_DESCRIPTION;
  return {
    title,
    description,
    ...visibleAuthorMeta(dict.headerName),
    alternates: { canonical: haberlerUrl("/") },
    metadataBase: new URL(haberlerUrl("/")),
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      title,
      description,
      url: haberlerUrl("/"),
    },
  };
}

function HaberCard({
  post,
  featured = false,
  priority = false,
}: {
  post: Awaited<ReturnType<typeof getAllGundemBriefings>>[number];
  featured?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href={haberlerUrl(haberlerArticlePath(post.slug))}
      data-gundem-card={featured ? "hero" : "grid"}
      className="group block overflow-hidden rounded-2xl bg-zinc-300/30 p-px transition-[background] duration-200 dark:bg-zinc-600/30"
    >
      <span className="relative block overflow-hidden rounded-[15px] bg-white dark:bg-zinc-950">
        <GundemCover post={post} priority={priority} />
        <span className="block p-4">
          <span className="text-xs font-medium text-zinc-500">{formatGundemCategory(post.category)}</span>
          <span
            className={`mt-1 block font-medium leading-snug text-zinc-950 dark:text-zinc-50 ${featured ? "text-xl" : "text-base"}`}
          >
            {post.title}
          </span>
          {featured ? (
            <span className="mt-2 line-clamp-2 block text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {post.excerpt}
            </span>
          ) : null}
          <time className="mt-3 block text-xs text-zinc-500" dateTime={post.publishedAt}>
            {formatGundemDate(post.publishedAt)}
          </time>
        </span>
      </span>
    </Link>
  );
}

export async function GundemIndexView() {
  const [posts, dict] = await Promise.all([getAllGundemBriefings(), getDictionary("tr")]);
  const [hero, ...rest] = posts;

  return (
    <div lang="tr" className="flex min-h-screen w-full flex-col">
      <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
        <header className="mb-8">
          <h1 className="text-lg font-medium">{HABERLER_PAGE_TITLE}</h1>
        </header>
        <main className="space-y-4 pb-16">
          {hero ? <HaberCard post={hero} featured priority /> : null}
          {rest.map((post) => (
            <HaberCard key={post.slug} post={post} />
          ))}
        </main>
        <SiteFooter name={dict.headerName} />
      </div>
    </div>
  );
}
