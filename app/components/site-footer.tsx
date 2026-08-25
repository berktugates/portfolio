import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "./theme-toggle";

type SiteFooterProps = {
  children?: ReactNode;
  className?: string;
};

export function SiteFooter({ children, className }: SiteFooterProps = {}) {
  return (
    <footer
      className={
        className ?? "mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800"
      }
    >
      <div className="flex items-center justify-between">
        <Link href="https://github.com/berktugates" target="_blank" rel="noreferrer">
          <p className="text-xs text-zinc-500">© {new Date().getFullYear()} Berktug Berke Ates</p>
        </Link>
        <div className="flex items-center gap-3">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
