import Image from "next/image";
import Link from "next/link";

type SiteHeaderProps = {
  homeHref?: string;
  name?: string;
  role?: string;
  ariaLabel?: string;
  imageAlt?: string;
};

export function SiteHeader({
  homeHref = "/",
  name = "Berktug Berke Ates",
  role = "Software Engineer",
  ariaLabel = "Berktug Berke Ates home",
  imageAlt = "Berktug Berke Ates",
}: SiteHeaderProps = {}) {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href={homeHref} aria-label={ariaLabel}>
          <Image
            src="/me.png"
            alt={imageAlt}
            width={48}
            height={48}
            priority
            className="h-12 w-12 rounded-md object-cover grayscale transition-all duration-300 hover:grayscale-0"
          />
        </Link>
        <div>
          <Link href={homeHref} className="font-medium">
            {name}
          </Link>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{role}</p>
        </div>
      </div>
    </header>
  );
}
