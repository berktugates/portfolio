import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getAllGundemBriefings } from "../lib/gundem/catalog";
import { haberlerArticlePath, haberlerUrl } from "../lib/gundem/hosts";
import { SITE_NAME } from "../lib/seo";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export const revalidate = 1800;

export async function createGundemIndexMetadata(): Promise<Metadata> {
  const title = "Gündem";
  const description =
    "Türkiye teknoloji ve dijital ekonomi brifingleri. First-party özet; ajans kopyası değildir.";
  return {
    title,
    description,
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
  const posts = await getAllGundemBriefings();
  return (
    <div lang="tr" className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col px-4 pt-20">
      <SiteHeader
        homeHref={haberlerUrl("/")}
        name={SITE_NAME}
        role="Software Engineer"
        ariaLabel="Ana sayfa"
        imageAlt={SITE_NAME}
      />
      <main className="flex flex-1 flex-col">
        <h1 className="mb-3 text-xl font-medium">Gündem</h1>
        <p className="mb-8 max-w-xl text-zinc-500 dark:text-zinc-400">
          Kısa, kaynaklı teknoloji brifingleri. Stok görseller olay fotoğrafı değildir.
        </p>
        <div className="space-y-1">
          {posts.map((post) => (
            <Link key={post.slug} href={haberlerUrl(haberlerArticlePath(post.slug))} className="blog-card group block">
              <span className="z-10 min-w-0 pr-4">
                <span className="flex items-center gap-2 font-medium text-zinc-950 dark:text-zinc-50">
                  {post.title}
                  <ArrowUpRight className="size-4 shrink-0 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="mt-1 block text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {post.excerpt}
                </span>
                <span className="mt-2 block text-xs text-zinc-400 dark:text-zinc-500">
                  <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter className="mt-8 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800" />
    </div>
  );
}
