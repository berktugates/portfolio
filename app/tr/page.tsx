import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { GlowCard } from "../components/glow-card";
import { SiteFooter } from "../components/site-footer";
import { projects } from "../data/projects";
import { sortedBlogPosts } from "../data/blogs";
import { AUTHOR_ID, SITE_LAST_MODIFIED, SITE_URL, WEBSITE_ID, absoluteUrl, jsonLd } from "../lib/seo";

const title = "Berktuğ Berke Ateş — Yazılım Mühendisi";
const description = "Marmaris, Muğla merkezli yazılım mühendisi Berktuğ Berke Ateş; web, mobil, yapay zekâ, backend ve ölçeklenebilir ürün mimarileri geliştiriyor.";
const projectSummaries: Record<string, string> = {
  "celestial-insights": "Kişisel astroloji, günlük farkındalık ve yapay zekâ destekli spiritüel keşif ürünü.",
  "medula-eczane": "Web ve mobil istemcileri kapsayan çok kiracılı eczane ERP sistemi.",
  strumai: "Gerçek zamanlı ses analizi ve yapay zekâ mentoruna sahip gitar çalışma sistemi.",
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: absoluteUrl("/tr"), languages: { en: SITE_URL, tr: absoluteUrl("/tr"), "x-default": SITE_URL } },
  openGraph: { type: "profile", locale: "tr_TR", url: absoluteUrl("/tr"), siteName: "Berktug Berke Ates", title, description, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${absoluteUrl("/tr")}#profile-page`,
  url: absoluteUrl("/tr"),
  name: title,
  description,
  inLanguage: "tr-TR",
  dateModified: SITE_LAST_MODIFIED,
  isPartOf: { "@id": WEBSITE_ID },
  mainEntity: { "@id": AUTHOR_ID },
};

export default function TurkishProfilePage() {
  const latestPosts = sortedBlogPosts.slice(0, 6);

  return (
    <div lang="tr" className="flex min-h-screen w-full flex-col">
      <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/tr" aria-label="Berktuğ Berke Ateş ana sayfa">
              <Image src="/me.png" alt="Berktuğ Berke Ateş" width={48} height={48} priority className="h-12 w-12 rounded-md object-cover grayscale transition-all duration-300 hover:grayscale-0" />
            </Link>
            <div><Link href="/tr" className="font-medium">Berktuğ Berke Ateş</Link><p className="text-sm text-zinc-500 dark:text-zinc-400">Yazılım Mühendisi</p></div>
          </div>
        </header>

        <main className="space-y-20">
          <section aria-labelledby="tr-intro-title">
            <h1 id="tr-intro-title" className="sr-only">Berktuğ Berke Ateş — Yazılım Mühendisi</h1>
            <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">Marmaris, Muğla merkezli bir yazılım mühendisi ve ürün geliştiricisiyim. Türkiye&apos;deki ve uluslararası ekipler için web, mobil ve yapay zekâ ürünlerini teknik tasarımdan üretim ortamına kadar uçtan uca geliştiriyorum. Odağım; karmaşık sistemleri güvenilir, ölçeklenebilir ve sürdürülebilir yazılım ürünlerine dönüştürmek.</p>
          </section>

          <section aria-labelledby="expertise-heading">
            <h2 id="expertise-heading" className="section-title">Uzmanlık Alanları</h2>
            <ul className="grid gap-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
              {["Yazılım ve ürün mimarisi", "Web ve backend geliştirme", "React Native mobil uygulamalar", "Yapay zekâ ürün mühendisliği", "API ve veri sistemleri", "Üretim güvenilirliği ve otomasyon"].map((item) => <li key={item} className="rounded-lg bg-zinc-50 px-3 py-2 ring-1 ring-inset ring-zinc-200/60 dark:bg-zinc-900 dark:ring-zinc-800">{item}</li>)}
            </ul>
          </section>

          <section aria-labelledby="tr-products-heading">
            <h2 id="tr-products-heading" className="section-title">Seçili Yazılım Ürünleri</h2>
            <div className="space-y-2">
              {projects.map((project) => <GlowCard key={project.slug} href={`/projects/${project.slug}`} label={`${project.title} projesini incele`}><span className="flex items-center justify-between gap-3"><span><span className="block font-medium">{project.title}</span><span className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">{projectSummaries[project.slug] ?? project.summary}</span></span><ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-zinc-400" /></span></GlowCard>)}
            </div>
          </section>

          <section aria-labelledby="tr-writing-heading">
            <div className="mb-3 flex items-end justify-between gap-4"><div><h2 id="tr-writing-heading" className="text-lg font-medium">Yazılım Mühendisliği Yazıları</h2><p className="mt-1 text-xs text-zinc-500">Makaleler İngilizcedir.</p></div><Link href="/blogs" className="text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50">Tümünü gör</Link></div>
            <div className="space-y-1">
              {latestPosts.map((post) => <Link key={post.slug} href={`/blogs/${post.slug}`} className="blog-card group"><span className="z-10 min-w-0 pr-4"><span className="font-medium text-zinc-950 dark:text-zinc-50">{post.title}</span><span className="mt-1 block text-sm leading-6 text-zinc-500 dark:text-zinc-400">{post.excerpt}</span></span><ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" /></Link>)}
            </div>
          </section>

          <section aria-labelledby="tr-contact-heading">
            <div className="rounded-2xl bg-zinc-50/40 p-6 ring-1 ring-inset ring-zinc-200/50 dark:bg-zinc-950/40 dark:ring-zinc-800/50"><h2 id="tr-contact-heading" className="mb-3 text-sm font-medium">İletişim ve İş Birliği</h2><p className="mb-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Yazılım ürünü, teknik mimari veya mühendislik iş birliği için iletişime geçebilirsiniz.</p><GlowCard href="mailto:contact@berktugberke.com" label="Berktuğ Berke Ateş'e e-posta gönder"><span className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800"><Mail aria-hidden="true" className="size-5" /></span><span><span className="block text-sm font-medium">E-posta gönder</span><span className="block text-xs text-zinc-500">contact@berktugberke.com</span></span></span></GlowCard></div>
          </section>
        </main>

        <SiteFooter languageHref="/" languageLabel="English" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </div>
  );
}
