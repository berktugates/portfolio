import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
};

function pageHref(page: number) {
  return page <= 1 ? "/blogs" : `/blogs/pages/${page}`;
}

export function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Blog pagination" className="mt-12 flex items-center justify-between border-t border-zinc-100 pt-6 dark:border-zinc-800">
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 text-sm text-zinc-300 dark:text-zinc-700" aria-hidden="true">
          <ChevronLeft className="size-4" />
          Previous
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
                  href={pageHref(page)}
                  className="inline-flex size-8 items-center justify-center rounded-lg text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                >
                  {page}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
        >
          Next
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 text-sm text-zinc-300 dark:text-zinc-700" aria-hidden="true">
          Next
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
