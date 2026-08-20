import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return <header className="mb-8 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <Link href="/" aria-label="Berktug Berke Ates home"><Image src="/me.png" alt="Berktug Berke Ates" width={48} height={48} priority className="h-12 w-12 rounded-md object-cover grayscale transition-all duration-300 hover:grayscale-0" /></Link>
      <div><Link href="/" className="font-medium">Berktug Berke Ates</Link><p className="text-sm text-zinc-500 dark:text-zinc-400">Software Engineer</p></div>
    </div>
  </header>;
}
