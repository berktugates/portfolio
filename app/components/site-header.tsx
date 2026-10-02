import Link from "next/link";

type SiteHeaderProps = {
  homeHref?: string;
  name?: string;
  role?: string;
  ariaLabel?: string;
};

export function SiteHeader({
  homeHref = "/",
  name = "Berktug Berke Ates",
  role = "Software Engineer",
  ariaLabel = "Berktug Berke Ates home",
}: SiteHeaderProps = {}) {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link href={homeHref} aria-label={ariaLabel} className="font-medium">
          {name}
        </Link>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{role}</p>
      </div>
    </header>
  );
}
