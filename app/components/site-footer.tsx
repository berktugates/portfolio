import type { ReactNode } from "react";
import { ThemeToggle } from "./theme-toggle";

type SiteFooterProps = {
  name: string;
  children?: ReactNode;
  className?: string;
};

export function SiteFooter({ name, children, className }: SiteFooterProps) {
  return (
    <footer
      className={
        className ?? "mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800"
      }
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} {name}
        </p>
        <div className="flex items-center gap-3">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
