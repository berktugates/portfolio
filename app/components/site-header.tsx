import Link from "next/link";

type SiteHeaderProps = {
  homeHref?: string;
  name?: string;
  role?: string;
  ariaLabel?: string;
  contactLabel?: string;
};

export function SiteHeader({
  homeHref = "/",
  name = "Berktug Berke Ates",
  role = "Software Engineer",
  ariaLabel = "Berktug Berke Ates home",
  contactLabel = "Contact",
}: SiteHeaderProps = {}) {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link href={homeHref} aria-label={ariaLabel} className="font-medium">
          {name}
        </Link>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{role}</p>
      </div>
      <Link
        href="/contact"
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
      >
        {contactLabel}
      </Link>
    </header>
  );
}
