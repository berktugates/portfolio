"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { BlogTransitionLink } from "./blog-transition-link";

const POSTS_PER_PAGE = 5;

export type HomeBlogListPost = {
  slug: string;
  title: string;
  excerpt: string;
  href: string;
};

type HomeBlogListProps = {
  posts: readonly HomeBlogListPost[];
  labels: {
    previous: string;
    next: string;
    ariaLabel: string;
  };
};

export function HomeBlogList({ posts, labels }: HomeBlogListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const firstPost = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(firstPost, firstPost + POSTS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    requestAnimationFrame(() => {
      document.getElementById("blog")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  return (
    <>
      <div className="space-y-1">
        {visiblePosts.map((post) => (
          <BlogTransitionLink key={post.slug} href={post.href} className="blog-card group">
            <span className="z-10 min-w-0 pr-4">
              <span className="flex items-center gap-2 font-medium text-zinc-950 dark:text-zinc-50">
                <span style={{ viewTransitionName: `blog-title-${post.slug}` }}>{post.title}</span>
                <ArrowUpRight className="size-4 shrink-0 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="mt-1 block text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {post.excerpt}
              </span>
            </span>
          </BlogTransitionLink>
        ))}
      </div>

      {totalPages > 1 ? (
        <nav
          aria-label={labels.ariaLabel}
          className="mt-8 border-t border-zinc-100 pt-6 dark:border-zinc-800"
        >
          <ol className="mb-4 flex flex-wrap items-center justify-center gap-1">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <li key={page}>
                <button
                  type="button"
                  aria-current={page === currentPage ? "page" : undefined}
                  aria-label={`${page}`}
                  onClick={() => goToPage(page)}
                  className={`inline-flex size-8 items-center justify-center rounded-lg text-sm transition-colors ${
                    page === currentPage
                      ? "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ol>
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 disabled:text-zinc-300 dark:hover:text-zinc-50 dark:disabled:text-zinc-700"
            >
              <ChevronLeft className="size-4" />
              {labels.previous}
            </button>
            <span className="sr-only" aria-live="polite">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 disabled:text-zinc-300 dark:hover:text-zinc-50 dark:disabled:text-zinc-700"
            >
              {labels.next}
              <ChevronRight className="size-4" />
            </button>
          </div>
        </nav>
      ) : null}
    </>
  );
}
