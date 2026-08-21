import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { BlogPagination } from "../components/blog-pagination";
import { BlogSubscribeModal } from "../components/blog-subscribe-modal";
import { BlogTransitionLink } from "../components/blog-transition-link";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { getBlogPage, getBlogTotalPages } from "../data/blogs";

type BlogsIndexProps = {
  page?: number;
};

export const blogsIndexMetadata = (page = 1): Metadata => {
  const canonical = page > 1 ? `/blogs/pages/${page}` : "/blogs";
  const title = page > 1 ? `Software Engineering & AI Blogs · Page ${page}` : "Software Engineering & AI Blogs";
  return {
    title,
    description:
      "Long-form writing on software architecture, AI product engineering, cross-platform mobile development, reliability, APIs, accessibility, and technical leadership.",
    keywords: [
      "software engineering blog",
      "AI engineering",
      "system design",
      "cross-platform mobile development",
      "production AI",
    ],
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description: "Practical writing on building dependable software, AI products, and engineering organizations.",
      url: canonical,
    },
  };
};

const date = (value: string) =>
  new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value));

export function BlogsIndex({ page = 1 }: BlogsIndexProps) {
  const totalPages = getBlogTotalPages();
  const posts = getBlogPage(page);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col px-4 pt-20">
      <SiteHeader />
      <main className="flex-1">
        <h1 className="mb-3 text-xl font-medium">Blogs</h1>
        <p className="mb-8 max-w-xl text-zinc-500 dark:text-zinc-400">
          Field notes on software architecture, AI products, cross-platform engineering, reliability, and technical
          leadership.
        </p>
        <div className="space-y-1">
          {posts.map((post) => (
            <BlogTransitionLink key={post.slug} href={`/blogs/${post.slug}`} className="blog-card group">
              <span className="z-10 min-w-0 pr-4">
                <span className="flex items-center gap-2 font-medium text-zinc-950 dark:text-zinc-50">
                  <span style={{ viewTransitionName: `blog-title-${post.slug}` }}>{post.title}</span>
                  <ArrowUpRight className="size-4 shrink-0 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="mt-1 block text-sm leading-6 text-zinc-500 dark:text-zinc-400">{post.excerpt}</span>
                <span className="mt-2 block text-xs text-zinc-400 dark:text-zinc-500">
                  <time dateTime={post.publishedAt}>{date(post.publishedAt)}</time> · {post.readingMinutes} min read
                </span>
              </span>
            </BlogTransitionLink>
          ))}
        </div>
        <BlogPagination currentPage={page} totalPages={totalPages} />
      </main>
      <SiteFooter />
      <BlogSubscribeModal />
    </div>
  );
}
