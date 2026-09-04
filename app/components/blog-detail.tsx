import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { blogPosts } from "../data/blogs";
import { getLocaleContent, getLocalizedBlogPost } from "../lib/content/get-content";
import { blogPostPath, blogsIndexPath } from "../lib/content/paths";
import type { Locale } from "../lib/i18n";
import { getDictionary, hreflangLanguages, localeMeta, localePath } from "../lib/i18n";
import { formatMessage } from "../lib/i18n/format";
import {
  AUTHOR_ID,
  SITE_NAME,
  WEBSITE_ID,
  absoluteUrl,
  jsonLd,
} from "../lib/seo";
import { BlogShare } from "./blog-share";
import { CopyUrl } from "./copy-url";
import { LanguageSwitcher } from "./language-switcher";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function blogStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

type BlogPageProps = { params: Promise<{ slug: string }> };

export async function createBlogMetadata(
  locale: Locale,
  { params }: BlogPageProps,
): Promise<Metadata> {
  const post = await getLocalizedBlogPost(locale, (await params).slug);
  if (!post) return {};

  const path = blogPostPath(locale, post.slug);
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(`/blogs/${post.slug}`),
  };
  for (const [hreflang, homeUrl] of Object.entries(hreflangLanguages())) {
    if (hreflang === "x-default") continue;
    const loc = Object.entries(localeMeta).find(([, meta]) => meta.hreflang === hreflang)?.[0] as
      | Locale
      | undefined;
    if (!loc) continue;
    languages[hreflang] = absoluteUrl(blogPostPath(loc, post.slug));
    void homeUrl;
  }

  return {
    title: post.title,
    description: post.description,
    keywords: [...post.keywords],
    authors: [{ name: SITE_NAME, url: absoluteUrl() }],
    alternates: { canonical: absoluteUrl(path), languages },
    openGraph: {
      type: "article",
      locale: localeMeta[locale].ogLocale,
      title: post.title,
      description: post.description,
      url: path,
      publishedTime: post.publishedAt,
      authors: ["Berktug Berke Ates"],
      tags: [...post.keywords],
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/opengraph-image"],
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
        "@id": `${absoluteUrl(path)}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE_NAME,
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
        "@id": `${absoluteUrl(path)}#article`,
        headline: post.title,
        description: post.description,
        image: absoluteUrl("/opengraph-image"),
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: meta.htmlLang,
        keywords: post.keywords,
        timeRequired: `PT${post.readingMinutes}M`,
        author: { "@id": AUTHOR_ID, "@type": "Person", name: SITE_NAME },
        publisher: { "@id": AUTHOR_ID, "@type": "Person", name: SITE_NAME },
      },
    ],
  };

  return (
    <div lang={meta.htmlLang} dir={meta.dir} className="relative mx-auto min-h-screen w-full max-w-screen-sm px-4 pt-20">
      <SiteHeader
        homeHref={homeHref}
        name={dict.headerName}
        role={dict.headerRole}
        ariaLabel={dict.headerAriaLabel}
        imageAlt={dict.headerImageAlt}
      />
      <div className="absolute right-4 top-24">
        <CopyUrl />
      </div>
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
            <h1 style={{ viewTransitionName: `blog-title-${post.slug}` }}>{post.title}</h1>
            <p className="!my-0 text-sm text-zinc-500 dark:text-zinc-400">
              <time dateTime={post.publishedAt}>{formattedDate}</time>
              {" · "}
              {formatMessage(content.ui.minRead, { minutes: post.readingMinutes })}
            </p>
            <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
            <BlogShare title={post.title} url={path} />
          </header>
          {post.sections.map((section) => (
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
                      <a href={link.url} target="_blank" rel="noreferrer noopener">{link.label}</a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          <hr />
          <p>
            <em>{formatMessage(content.ui.publishedBy, { date: formattedDate })}</em>
          </p>
        </article>
      </main>
      <SiteFooter>
        <LanguageSwitcher locale={locale} />
      </SiteFooter>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </div>
  );
}
