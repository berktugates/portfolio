import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlogTransitionLink } from "./blog-transition-link";
import { LanguageSwitcher } from "./language-switcher";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { getLocalizedBlogPosts } from "../lib/content/get-content";
import { blogPostPath, blogsIndexPath } from "../lib/content/paths";
import {
  type Locale,
  getDictionary,
  hreflangLanguages,
  localeMeta,
  localePath,
  localeUrl,
} from "../lib/i18n";
import { shareImageMeta } from "../lib/share-image";
import { AUTHOR_ID, visibleAuthorMeta, WEBSITE_ID, jsonLd } from "../lib/seo";

export async function createHomeMetadata(locale: Locale): Promise<Metadata> {
  const dict = await getDictionary(locale);
  const meta = localeMeta[locale];
  const url = localeUrl(locale);
  const image = shareImageMeta(locale, dict.metaTitle);

  return {
    title: { absolute: dict.metaTitle },
    description: dict.metaDescription,
    ...visibleAuthorMeta(dict.headerName),
    alternates: {
      canonical: url,
      languages: hreflangLanguages(),
    },
    openGraph: {
      type: "profile",
      locale: meta.ogLocale,
      url,
      siteName: dict.headerName,
      title: dict.metaTitle,
      description: dict.metaDescription,
      images: image.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metaTitle,
      description: dict.metaDescription,
      images: image.twitter,
    },
  };
}

export async function HomePage({ locale }: { locale: Locale }) {
  const [dict, localizedPosts] = await Promise.all([
    getDictionary(locale),
    getLocalizedBlogPosts(locale),
  ]);
  const meta = localeMeta[locale];
  const latestPost = localizedPosts[0];
  const homeHref = localePath(locale);
  const cjk = locale === "zh" || locale === "ja";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${localeUrl(locale)}#profile-page`,
    url: localeUrl(locale),
    name: dict.metaTitle,
    description: dict.intro,
    inLanguage: meta.htmlLang,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": AUTHOR_ID },
  };

  return (
    <div
      lang={meta.htmlLang}
      dir={meta.dir}
      className={`flex min-h-screen w-full flex-col${cjk ? " font-sans tracking-normal" : ""}`}
      style={
        cjk
          ? {
              fontFamily:
                'system-ui, -apple-system, "Segoe UI", "PingFang SC", "Hiragino Sans", "Noto Sans SC", "Noto Sans JP", "Microsoft YaHei", sans-serif',
            }
          : undefined
      }
    >
      <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
        <SiteHeader
          homeHref={homeHref}
          name={dict.headerName}
          role={dict.headerRole}
          ariaLabel={dict.headerAriaLabel}
        />
        <main className="space-y-24">
          <section aria-labelledby="intro-title">
            <h1 id="intro-title" className="sr-only">
              {dict.h1}
            </h1>
            <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{dict.intro}</p>
          </section>

          <section id="blog" aria-labelledby="blog-heading">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="blog-heading" className="text-lg font-medium">
                {dict.latestBlog}
              </h2>
              <Link
                href={blogsIndexPath(locale)}
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
              >
                {dict.viewAll}
              </Link>
            </div>
            <BlogTransitionLink href={blogPostPath(locale, latestPost.slug)} className="blog-card group">
              <span className="z-10">
                <span className="flex items-center gap-2">
                  <span style={{ viewTransitionName: `blog-title-${latestPost.slug}` }}>
                    {latestPost.title}
                  </span>
                  <ArrowUpRight className="size-4 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="mt-1 block text-zinc-500 dark:text-zinc-400">{latestPost.excerpt}</span>
              </span>
            </BlogTransitionLink>
          </section>
        </main>
        <SiteFooter name={dict.headerName}>
          <LanguageSwitcher locale={locale} />
        </SiteFooter>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </div>
  );
}
