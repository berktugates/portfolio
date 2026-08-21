import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { BlogTransitionLink } from "../components/blog-transition-link";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { sortedBlogPosts } from "../data/blogs";

export const metadata: Metadata = {
  title: "Software Engineering & AI Blogs",
  description: "Long-form writing on software architecture, AI product engineering, cross-platform mobile development, reliability, APIs, accessibility, and technical leadership.",
  keywords: ["software engineering blog", "AI engineering", "staff engineer", "system design", "cross-platform mobile development"],
  alternates: { canonical: "/blogs" },
  openGraph: { type: "website", title: "Software Engineering & AI Blogs", description: "Practical writing on building dependable software, AI products, and engineering organizations.", url: "/blogs" },
};

const date = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value));

export default function BlogsPage() {
  return <div className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col px-4 pt-20">
    <SiteHeader />
    <main className="flex-1">
      <h1 className="mb-3 text-xl font-medium">Blogs</h1>
      <p className="mb-8 max-w-xl text-zinc-500 dark:text-zinc-400">Field notes on software architecture, AI products, cross-platform engineering, reliability, and technical leadership.</p>
      <div className="space-y-1">
        {sortedBlogPosts.map((post) => <BlogTransitionLink key={post.slug} href={`/blogs/${post.slug}`} className="blog-card group">
          <span className="z-10 min-w-0 pr-4">
            <span className="flex items-center gap-2 font-medium text-zinc-950 dark:text-zinc-50">
              <span style={{ viewTransitionName: `blog-title-${post.slug}` }}>{post.title}</span>
              <ArrowUpRight className="size-4 shrink-0 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
            <span className="mt-1 block text-sm leading-6 text-zinc-500 dark:text-zinc-400">{post.excerpt}</span>
            <span className="mt-2 block text-xs text-zinc-400 dark:text-zinc-500"><time dateTime={post.publishedAt}>{date(post.publishedAt)}</time> · {post.readingMinutes} min read</span>
          </span>
        </BlogTransitionLink>)}
      </div>
    </main>
    <SiteFooter />
  </div>;
}
