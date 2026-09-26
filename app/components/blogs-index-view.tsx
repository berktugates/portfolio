import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { blogIndexHreflangLocales, blogIndexPageCount } from "../lib/content/blog-locale-overlay";
import {
  getBlogTotalPagesFromCount,
  getLocaleContent,
  getLocalizedBlogPage,
  getLocalizedBlogPosts,
} from "../lib/content/get-content";
import { blogPostPath, blogsIndexPath } from "../lib/content/paths";
import type { Locale } from "../lib/i18n";
import { getDictionary, localeMeta, localePath } from "../lib/i18n";
import { formatMessage } from "../lib/i18n/format";
import { absoluteUrl, visibleAuthorMeta } from "../lib/seo";
import { shareImageMeta } from "../lib/share-image";
import { BlogPagination } from "./blog-pagination";
import { BlogSubscribeModal } from "./blog-subscribe-modal";
import { BlogTransitionLink } from "./blog-transition-link";
import { LanguageSwitcher } from "./language-switcher";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export async function createBlogsIndexMetadata(
  locale: Locale,
  page = 1,
): Promise<Metadata> {
  const [content, dict] = await Promise.all([getLocaleContent(locale), getDictionary(locale)]);
  const path = blogsIndexPath(locale, page);
  const title =
    page > 1
      ? formatMessage(content.ui.blogsMetaTitlePaged, { page })
      : content.ui.blogsMetaTitle;

  const siblings = blogIndexHreflangLocales(locale, page);
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(blogsIndexPath(siblings.includes("en") ? "en" : locale, page)),
  };
  for (const loc of siblings) {
    languages[localeMeta[loc].hreflang] = absoluteUrl(blogsIndexPath(loc, page));
  }

  const image = shareImageMeta(locale, title);
  return {
    title,
    description: content.ui.blogsMetaDescription,
    ...visibleAuthorMeta(dict.headerName),
    alternates: { canonical: absoluteUrl(path), languages },
    openGraph: {
      type: "website",
      locale: localeMeta[locale].ogLocale,
      title,
      description: content.ui.blogsMetaDescription,
      url: absoluteUrl(path),
      images: image.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: content.ui.blogsMetaDescription,
      images: image.twitter,
    },
  };
}

export function blogPagedStaticParams(locale: Locale) {
  const totalPages = blogIndexPageCount(locale);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export function isBlogIndexPage(locale: Locale, page: number) {
  return Number.isInteger(page) && page >= 2 && page <= blogIndexPageCount(locale);
}

export async function BlogsIndexView({
  locale,
  page = 1,
}: {
  locale: Locale;
  page?: number;
}) {
  const [content, dict, posts, allPosts] = await Promise.all([
    getLocaleContent(locale),
    getDictionary(locale),
    getLocalizedBlogPage(locale, page),
    getLocalizedBlogPosts(locale),
  ]);
  const totalPages = getBlogTotalPagesFromCount(allPosts.length);
  const meta = localeMeta[locale];
  const homeHref = localePath(locale);
  const dateFormatter = new Intl.DateTimeFormat(meta.htmlLang, {
    dateStyle: "medium",
    timeZone: "UTC",
  });

  return (
    <div
      lang={meta.htmlLang}
      dir={meta.dir}
      className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col px-4 pt-20"
    >
      <SiteHeader
        homeHref={homeHref}
        name={dict.headerName}
        role={dict.headerRole}
        ariaLabel={dict.headerAriaLabel}
        imageAlt={dict.headerImageAlt}
      />
      <main className="flex flex-1 flex-col">
        <h1 className="mb-3 text-xl font-medium">{content.ui.blogs}</h1>
        <p className="mb-8 max-w-xl text-zinc-500 dark:text-zinc-400">{content.ui.blogsIntro}</p>
        <div className="space-y-1">
          {posts.map((post) => (
            <BlogTransitionLink
              key={post.slug}
              href={blogPostPath(locale, post.slug)}
              className="blog-card group"
            >
              <span className="z-10 min-w-0 pr-4">
                <span className="flex items-center gap-2 font-medium text-zinc-950 dark:text-zinc-50">
                  <span style={{ viewTransitionName: `blog-title-${post.slug}` }}>{post.title}</span>
                  <ArrowUpRight className="size-4 shrink-0 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="mt-1 block text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {post.excerpt}
                </span>
                <span className="mt-2 block text-xs text-zinc-400 dark:text-zinc-500">
                  <time dateTime={post.publishedAt}>
                    {dateFormatter.format(new Date(post.publishedAt))}
                  </time>
                  {" · "}
                  {formatMessage(content.ui.minRead, { minutes: post.readingMinutes })}
                </span>
              </span>
            </BlogTransitionLink>
          ))}
        </div>
        <div className="mt-auto pt-12">
          <BlogPagination
            locale={locale}
            currentPage={page}
            totalPages={totalPages}
            labels={{
              previous: content.ui.previous,
              next: content.ui.next,
              ariaLabel: content.ui.paginationAria,
            }}
          />
        </div>
      </main>
      <SiteFooter name={dict.headerName} className="mt-8 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800">
        <LanguageSwitcher locale={locale} />
      </SiteFooter>
      <BlogSubscribeModal copy={content.ui.subscribe} />
    </div>
  );
}
