import Link from "next/link";
import type { ReactNode } from "react";
import { HaberlerShell } from "./haberler-shell";
import { SiteFooter } from "./site-footer";
import { HABERLER_PAGE_TITLE } from "../lib/gundem/editorial";

export function GundemInfoLayout({ title, lead, children }: { title: string; lead: string; children: ReactNode }) {
  return (
    <HaberlerShell>
      <main className="blog-prose mx-auto max-w-3xl pb-12">
        <nav className="mb-6 text-sm text-zinc-500"><Link href="/">{HABERLER_PAGE_TITLE}</Link> / {title}</nav>
        <h1>{title}</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300">{lead}</p>
        {children}
      </main>
      <SiteFooter name="Berktuğ Berke Ateş">
        <Link className="text-xs text-zinc-500" href="/kunye">Künye</Link>
        <Link className="text-xs text-zinc-500" href="/editorial-policy">Editöryal politika</Link>
        <Link className="text-xs text-zinc-500" href="/duzeltme-talebi">Düzeltme</Link>
      </SiteFooter>
    </HaberlerShell>
  );
}
