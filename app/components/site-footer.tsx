import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

type SiteFooterProps = {
  languageHref?: string;
  languageLabel?: string;
};

export function SiteFooter({ languageHref = "/tr", languageLabel = "Türkçe" }: SiteFooterProps = {}) {
  return <footer className="mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800"><div className="flex items-center justify-between"><Link href="https://github.com/berktugates" target="_blank" rel="noreferrer"><p className="text-xs text-zinc-500">© {new Date().getFullYear()} Berktug Berke Ates</p></Link><div className="flex items-center gap-3"><Link href={languageHref} hrefLang={languageHref === "/tr" ? "tr" : "en"} className="text-xs text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50">{languageLabel}</Link><ThemeToggle /></div></div></footer>;
}
