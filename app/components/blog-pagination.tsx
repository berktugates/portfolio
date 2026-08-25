import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { blogsIndexPath } from "../lib/content/paths";
import type { Locale } from "../lib/i18n/config";

type BlogPaginationProps = {
  locale: Locale;
  currentPage: number;
  totalPages: number;
  labels: {
    previous: string;
    next: string;
    ariaLabel: string;
  };
};

export function BlogPagination({
  locale,
  currentPage,
  totalPages,
  labels,
}: BlogPaginationProps) {
  const pageCount = Math.max(1, totalPages);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav
      aria-label={labels.ariaLabel}
      className="flex items-center justify-between border-t border-zinc-100 pt-6 dark:border-zinc-800"
    >
      {currentPage > 1 ? (
        <Link
          href={blogsIndexPath(locale, currentPage - 1)}
          className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
        >
          <ChevronLeft className="size-4" />
          {labels.previous}
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1 text-sm text-zinc-300 dark:text-zinc-700"
          aria-hidden="true"
        >
          <ChevronLeft className="size-4" />
          {labels.previous}
        </span>
      )}

      <ol className="flex items-center gap-1">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <li key={page}>
              {isActive ? (
                <span
                  aria-current="page"
                  className="inline-flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-sm text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50"
                >
                  {page}
                </span>
              ) : (
                <Link
                  href={blogsIndexPath(locale, page)}
                  className="inline-flex size-8 items-center justify-center rounded-lg text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                >
                  {page}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {currentPage < pageCount ? (
        <Link
          href={blogsIndexPath(locale, currentPage + 1)}
          className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
        >
          {labels.next}
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1 text-sm text-zinc-300 dark:text-zinc-700"
          aria-hidden="true"
        >
          {labels.next}
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
