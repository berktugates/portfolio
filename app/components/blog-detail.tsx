import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, permanentRedirect } from "next/navigation";
import { getCatalogBlogSlugs } from "../lib/content/blog-catalog";
import { blogHreflangLocalesForSlug, hasBlogLocale } from "../lib/content/blog-locale-overlay";
import { getLocaleContent, getLocalizedBlogPost } from "../lib/content/get-content";
import { blogPostPath, blogsIndexPath, contactPath } from "../lib/content/paths";
import type { Locale } from "../lib/i18n";
import { getDictionary, localeMeta, localePath } from "../lib/i18n";
import { formatMessage } from "../lib/i18n/format";
import { toSchemaDateTime } from "../lib/schema-dates";
import { shareImageMeta, shareImagePath } from "../lib/share-image";
import {
  AUTHOR_ID,
  visibleAuthorMeta,
  WEBSITE_ID,
  absoluteUrl,
  jsonLd,
  pageSchemaId,
} from "../lib/seo";
import { BlogShare } from "./blog-share";
import { CopyUrl } from "./copy-url";
import { LanguageSwitcher } from "./language-switcher";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { AdsenseDisplay } from "./adsense-display";
import { AdsenseScript } from "./adsense-script";

export async function blogStaticParams() {
  const slugs = await getCatalogBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

type BlogPageProps = { params: Promise<{ slug: string }> };

export async function createBlogMetadata(
  locale: Locale,
  { params }: BlogPageProps,
): Promise<Metadata> {
  const slug = (await params).slug;
  if (locale !== "en" && !(await hasBlogLocale(locale, slug))) return {};
  const [post, dict] = await Promise.all([getLocalizedBlogPost(locale, slug), getDictionary(locale)]);
  if (!post) return {};

  const path = blogPostPath(locale, post.slug);
  const availableLocales = await blogHreflangLocalesForSlug(post.slug);
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(`/blogs/${post.slug}`),
  };
  for (const loc of availableLocales) {
    languages[localeMeta[loc].hreflang] = absoluteUrl(blogPostPath(loc, post.slug));
  }

  const published = toSchemaDateTime(post.publishedAt);
  const modified = toSchemaDateTime(post.dateModified, post.publishedAt);
  const image = shareImageMeta(locale, post.title);

  return {
    title: post.title,
    description: post.description,
    ...visibleAuthorMeta(dict.headerName),
    alternates: {
      canonical: absoluteUrl(path),
      languages,
      types: {
        "application/rss+xml": absoluteUrl(`${blogsIndexPath(locale)}/rss.xml`),
        "text/markdown": absoluteUrl(`${path}/md`),
      },
    },
    openGraph: {
      type: "article",
      locale: localeMeta[locale].ogLocale,
      title: post.title,
      description: post.description,
      url: absoluteUrl(path),
      publishedTime: published,
      modifiedTime: modified,
      authors: [dict.headerName],
      images: image.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: image.twitter,
    },
  };
}

export async function BlogDetailPage({
  locale,
  params,
}: {
  locale: Locale;
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  if (locale !== "en" && !(await hasBlogLocale(locale, slug))) {
    permanentRedirect(`/blogs/${slug}`);
  }
  const [post, content, dict] = await Promise.all([
    getLocalizedBlogPost(locale, slug),
    getLocaleContent(locale),
    getDictionary(locale),
  ]);
  if (!post) notFound();

  const meta = localeMeta[locale];
  const homeHref = localePath(locale);
  const path = blogPostPath(locale, post.slug);
  const dateFormatter = new Intl.DateTimeFormat(meta.htmlLang, {
    dateStyle: "long",
    timeZone: "UTC",
  });
  const formattedDate = dateFormatter.format(new Date(post.publishedAt));

  const blogsPath = blogsIndexPath(locale);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": pageSchemaId(absoluteUrl(path), "breadcrumb"),
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: dict.headerName,
            item: absoluteUrl(homeHref),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: content.ui.blogs,
            item: absoluteUrl(blogsPath),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: absoluteUrl(path),
          },
        ],
      },
      {
        "@type": "BlogPosting",
        "@id": absoluteUrl(path),
        headline: post.title,
        description: post.description,
        image: absoluteUrl(shareImagePath(locale)),
        datePublished: toSchemaDateTime(post.publishedAt),
        dateModified: toSchemaDateTime(post.dateModified, post.publishedAt),
        mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: meta.htmlLang,
        timeRequired: `PT${post.readingMinutes}M`,
        author: { "@id": AUTHOR_ID, "@type": "Person", name: dict.headerName },
        publisher: { "@id": AUTHOR_ID, "@type": "Person", name: dict.headerName },
      },
      ...(post.faqJsonLd ? [post.faqJsonLd as Record<string, unknown>] : []),
    ],
  };

  return (
    <div lang={meta.htmlLang} dir={meta.dir} className="mx-auto min-h-screen w-full max-w-screen-sm px-4 pt-20">
      <AdsenseScript />
      <SiteHeader
        homeHref={homeHref}
        name={dict.headerName}
        role={dict.headerRole}
        ariaLabel={dict.headerAriaLabel}
        contactLabel={dict.contact}
        contactHref={contactPath(locale)}
      />
      <main className="blog-prose mt-12 pb-20">
        <Link
          href={blogsIndexPath(locale)}
          className="mb-12 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
        >
          <ArrowLeft className="size-4" />
          {content.ui.blogs}
        </Link>
        <article>
          <header className="mb-10">
            <div className="not-prose mb-4 flex items-start justify-between gap-3 sm:gap-4">
              <h1
                className="min-w-0 flex-1 text-balance text-xl font-medium text-zinc-950 dark:text-zinc-50"
                style={{ viewTransitionName: `blog-title-${post.slug}` }}
              >
                {post.title}
              </h1>
              <div className="shrink-0 pt-0.5 sm:pt-1">
                <CopyUrl />
              </div>
            </div>
            <p className="!my-0 text-sm text-zinc-500 dark:text-zinc-400">
              <time dateTime={post.publishedAt}>{formattedDate}</time>
              {" · "}
              {formatMessage(content.ui.minRead, { minutes: post.readingMinutes })}
            </p>
            <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
            <BlogShare
              title={post.title}
              url={path}
              label={content.ui.shareArticle}
              navAriaLabel={content.ui.shareNavAria}
              facebookAriaLabel={content.ui.shareOnFacebook}
              xAriaLabel={content.ui.shareOnX}
              redditAriaLabel={content.ui.shareOnReddit}
              whatsAppAriaLabel={content.ui.shareOnWhatsApp}
            />
          </header>
          <AdsenseDisplay slotKind="blog" />
          {post.contentHtml ? (
            <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          ) : (
            post.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.points ? (
                  <ul>
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}
                {section.links ? (
                  <ul>
                    {section.links.map((link) => (
                      <li key={link.url}>
                        <a href={link.url} target="_blank" rel="noreferrer noopener">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))
          )}
          <hr />
          <p>
            <em>{formatMessage(content.ui.publishedBy, { date: formattedDate })}</em>
          </p>
        </article>
      </main>
      <SiteFooter name={dict.headerName}>
        <LanguageSwitcher locale={locale} />
      </SiteFooter>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </div>
  );
}
