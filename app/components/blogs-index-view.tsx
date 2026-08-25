import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getBlogTotalPages } from "../data/blogs";
import {
  getLocaleContent,
  getLocalizedBlogPage,
} from "../lib/content/get-content";
import { blogPostPath, blogsIndexPath } from "../lib/content/paths";
import type { Locale } from "../lib/i18n";
import { getDictionary, hreflangLanguages, localeMeta, localePath } from "../lib/i18n";
import { formatMessage } from "../lib/i18n/format";
import { absoluteUrl } from "../lib/seo";
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
  const content = await getLocaleContent(locale);
  const path = blogsIndexPath(locale, page);
  const title =
    page > 1
      ? formatMessage(content.ui.blogsMetaTitlePaged, { page })
      : content.ui.blogsMetaTitle;

  const languages: Record<string, string> = {
    "x-default": absoluteUrl(page > 1 ? `/blogs/pages/${page}` : "/blogs"),
  };
  for (const [hreflang] of Object.entries(hreflangLanguages())) {
    if (hreflang === "x-default") continue;
    const loc = Object.entries(localeMeta).find(([, meta]) => meta.hreflang === hreflang)?.[0] as
      | Locale
      | undefined;
    if (!loc) continue;
    languages[hreflang] = absoluteUrl(blogsIndexPath(loc, page));
  }

  return {
    title,
    description: content.ui.blogsMetaDescription,
    alternates: { canonical: absoluteUrl(path), languages },
    openGraph: {
      type: "website",
      locale: localeMeta[locale].ogLocale,
      title,
      description: content.ui.blogsMetaDescription,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: content.ui.blogsMetaDescription,
      images: ["/opengraph-image"],
    },
  };
}

export async function BlogsIndexView({
  locale,
  page = 1,
}: {
  locale: Locale;
  page?: number;
}) {
  const [content, dict, posts] = await Promise.all([
    getLocaleContent(locale),
    getDictionary(locale),
    getLocalizedBlogPage(locale, page),
  ]);
  const totalPages = getBlogTotalPages();
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
      <SiteFooter className="mt-8 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800">
        <LanguageSwitcher locale={locale} />
      </SiteFooter>
      <BlogSubscribeModal copy={content.ui.subscribe} />
    </div>
  );
}
