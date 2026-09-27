import type { Metadata } from "next";
import Link from "next/link";
import { GundemCover } from "./gundem-cover";
import { getAllGundemBriefings } from "../lib/gundem/catalog";
import {
  GUNDEM_HEADER_ROLE,
  GUNDEM_INDEX_LEDE,
  GUNDEM_META_DESCRIPTION,
  formatGundemCategory,
  formatGundemDate,
} from "../lib/gundem/editorial";
import { haberlerArticlePath, haberlerUrl } from "../lib/gundem/hosts";
import { getDictionary } from "../lib/i18n";
import { visibleAuthorMeta } from "../lib/seo";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export const revalidate = 1800;

export async function createGundemIndexMetadata(): Promise<Metadata> {
  const dict = await getDictionary("tr");
  const title = "Gündem";
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

export async function GundemIndexView() {
  const [posts, dict] = await Promise.all([getAllGundemBriefings(), getDictionary("tr")]);
  return (
    <div lang="tr" className="mx-auto flex min-h-screen w-full max-w-[1100px] flex-col px-4 pt-20">
      <SiteHeader
        homeHref={haberlerUrl("/")}
        name={dict.headerName}
        role={GUNDEM_HEADER_ROLE}
        ariaLabel="Ana sayfa"
        imageAlt={dict.headerName}
      />
      <main className="flex flex-1 flex-col">
        <h1 className="mb-3 text-xl font-medium">Gündem</h1>
        <p className="mb-8 max-w-xl text-zinc-500 dark:text-zinc-400">{GUNDEM_INDEX_LEDE}</p>
        {posts[0] ? (
          <Link
            href={haberlerUrl(haberlerArticlePath(posts[0].slug))}
            data-gundem-card="hero"
            className="group block overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
          >
            <GundemCover post={posts[0]} priority />
            <span className="block p-4">
              <span className="text-xs font-medium text-zinc-500">{formatGundemCategory(posts[0].category)}</span>
              <span className="mt-1 block text-2xl font-medium leading-tight text-zinc-950 dark:text-zinc-50">
                {posts[0].title}
              </span>
              <span className="mt-2 line-clamp-2 block text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {posts[0].excerpt}
              </span>
              <time className="mt-3 block text-xs text-zinc-500" dateTime={posts[0].publishedAt}>
                {formatGundemDate(posts[0].publishedAt)}
              </time>
            </span>
          </Link>
        ) : null}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {posts.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={haberlerUrl(haberlerArticlePath(post.slug))}
              data-gundem-card="grid"
              className="block overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
            >
              <GundemCover post={post} />
              <span className="block p-4">
                <span className="text-xs font-medium text-zinc-500">{formatGundemCategory(post.category)}</span>
                <span className="mt-1 block font-medium text-zinc-950 dark:text-zinc-50">{post.title}</span>
                <time className="mt-2 block text-xs text-zinc-500" dateTime={post.publishedAt}>
                  {formatGundemDate(post.publishedAt)}
                </time>
              </span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter name={dict.headerName} className="mt-8 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800" />
    </div>
  );
}
