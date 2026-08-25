import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { GitHubActivity } from "../components/github-activity";
import { GlowCard } from "../components/glow-card";
import { BlogTransitionLink } from "../components/blog-transition-link";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { ProjectsCarousel } from "../components/projects-carousel";
import { sortedBlogPosts } from "../data/blogs";
import { AUTHOR_ID, SITE_LAST_MODIFIED, SITE_URL, WEBSITE_ID, absoluteUrl, jsonLd } from "../lib/seo";

const title = "Berktuğ Berke Ateş — Yazılım Mühendisi ve Ürün Geliştirici";
const description =
  "Yazılım mühendisi ve ürün geliştirici Berktuğ Berke Ateş; ölçeklenebilir yazılım ürünleri, karmaşık dijital sistemler, altyapı, yapay zekâ sistemleri, otomasyon ve uçtan uca üretim odaklı ürünler tasarlıyor.";
const intro =
  "Marmaris, Muğla merkezli yazılım mühendisi ve ürün geliştirici Berktuğ Berke Ateş; ölçeklenebilir yazılım ürünleri ve karmaşık dijital sistemler tasarlayıp geliştiriyor. Çalışmaları yazılım mimarisi, backend mühendisliği, altyapı, yapay zekâ sistemleri, otomasyon ve teknik tasarımdan üretim ortamına kadar uçtan uca ürün geliştirmeyi kapsıyor.";

const projectSummaries: Record<string, string> = {
  "celestial-insights": "Kişisel astroloji, günlük farkındalık ve yapay zekâ destekli spiritüel keşif.",
  "medula-eczane": "Web ve mobil istemcileri kapsayan çok kiracılı eczane ERP sistemi.",
  strumai: "Gerçek zamanlı ses analizi ve yapay zekâ mentoruna sahip gitar çalışma sistemi.",
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: absoluteUrl("/tr"),
    languages: { en: SITE_URL, tr: absoluteUrl("/tr"), "x-default": SITE_URL },
  },
  openGraph: {
    type: "profile",
    locale: "tr_TR",
    url: absoluteUrl("/tr"),
    siteName: "Berktug Berke Ates",
    title,
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
  },
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

function ArrowIcon() {
  return (
    <ArrowUpRight
      aria-hidden="true"
      className="size-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    />
  );
}

export default function TurkishHomePage() {
  const latestPost = sortedBlogPosts[0];

  return (
    <div lang="tr" className="flex min-h-screen w-full flex-col">
      <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
        <SiteHeader
          homeHref="/tr"
          name="Berktuğ Berke Ateş"
          role="Yazılım Mühendisi"
          ariaLabel="Berktuğ Berke Ateş ana sayfa"
          imageAlt="Berktuğ Berke Ateş"
        />
        <main className="space-y-24">
          <section aria-labelledby="intro-title">
            <h1 id="intro-title" className="sr-only">
              Berktuğ Berke Ateş — Yazılım Mühendisi ve Ürün Geliştirici
            </h1>
            <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{intro}</p>
          </section>

          <section aria-labelledby="products-heading">
            <h2 id="products-heading" className="section-title">
              Ürünler
            </h2>
            <ProjectsCarousel summaries={projectSummaries} locale="tr" />
          </section>

          <section aria-labelledby="experience-heading">
            <h2 id="experience-heading" className="section-title">
              İş Deneyimi
            </h2>
            <div className="space-y-2">
              <GlowCard href="https://figtures.com" label="Figtures Kurucu Ortağı">
                <span className="flex min-h-12 w-full items-start justify-between gap-4">
                  <span className="flex items-start gap-3">
                    <span className="mt-1 grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-900 transition-colors duration-200 group-hover:bg-zinc-800">
                      <Image
                        src="/figtures-logo.png"
                        alt="Figtures logosu"
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span>
                      <span className="block">Kurucu Ortak</span>
                      <span className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                        Figtures · İstanbul{" "}
                        <ArrowUpRight className="hidden size-4 shrink-0 text-zinc-400 transition-all delay-100 duration-200 group-hover:block group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                      </span>
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-sm text-zinc-600 dark:text-zinc-400 sm:block">
                    Mar 2026 – Günümüz
                  </span>
                </span>
              </GlowCard>
              <GlowCard href="https://www.bradi.tech" label="bradi.tech Full-stack Yazılım Mühendisi">
                <span className="flex min-h-12 w-full items-start justify-between gap-4">
                  <span className="flex items-start gap-3">
                    <span className="mt-1 grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-100 transition-colors duration-200 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                      <Image
                        src="/bradi-logo.png"
                        alt="bradi.tech logosu"
                        width={40}
                        height={40}
                        className="h-full w-full object-contain p-1"
                      />
                    </span>
                    <span>
                      <span className="block">Full-stack Yazılım Mühendisi</span>
                      <span className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                        bradi.tech · Londra{" "}
                        <ArrowUpRight className="hidden size-4 shrink-0 text-zinc-400 transition-all delay-100 duration-200 group-hover:block group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                      </span>
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-sm text-zinc-600 dark:text-zinc-400 sm:block">
                    Kas 2024 – Günümüz
                  </span>
                </span>
              </GlowCard>
            </div>
            <GitHubActivity locale="tr" />
          </section>

          <section aria-labelledby="education-heading">
            <h2 id="education-heading" className="section-title">
              Eğitim
            </h2>
            <GlowCard>
              <span className="flex min-h-12 w-full items-start justify-between gap-4">
                <span className="flex items-start gap-3">
                  <span className="mt-1 grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-100 transition-colors duration-200 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                    <Image
                      src="/firat-university.png"
                      alt="Fırat Üniversitesi logosu"
                      width={40}
                      height={40}
                      className="h-full w-full object-contain p-1"
                    />
                  </span>
                  <span>
                    <span className="block">Yazılım Mühendisliği Lisans</span>
                    <span className="block text-zinc-500 dark:text-zinc-400">Fırat Üniversitesi</span>
                  </span>
                </span>
                <span className="hidden shrink-0 text-sm text-zinc-600 dark:text-zinc-400 sm:block">
                  2020 – 2025
                </span>
              </span>
            </GlowCard>
          </section>

          <section aria-labelledby="contact-heading">
            <div className="rounded-2xl bg-zinc-50/40 p-6 ring-1 ring-inset ring-zinc-200/50 dark:bg-zinc-950/40 dark:ring-zinc-800/50">
              <div className="flex h-full flex-col justify-between space-y-6">
                <div>
                  <h2
                    id="contact-heading"
                    className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-100"
                  >
                    İletişim
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Bir projeniz mi var, yoksa sadece bağlantı kurmak mı istiyorsunuz? Anlamlı
                    sohbetlere ve iş birliklerine her zaman açığım.
                  </p>
                </div>
                <GlowCard href="mailto:contact@berktugberke.com" label="Berktuğ Berke Ateş'e e-posta gönder">
                  <span className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-zinc-100 transition-colors group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                      <Mail className="size-5 text-zinc-700 dark:text-zinc-300" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        E-posta gönder
                      </span>
                      <span className="block text-xs text-zinc-600 dark:text-zinc-400">
                        contact@berktugberke.com
                      </span>
                    </span>
                    <ArrowIcon />
                  </span>
                </GlowCard>
                <nav aria-label="Sosyal profiller" className="flex flex-wrap gap-2">
                  <a
                    href="https://github.com/berktugates"
                    target="_blank"
                    rel="me noreferrer"
                    className="inline-flex shrink-0 items-center rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/berktugates/"
                    target="_blank"
                    rel="me noreferrer"
                    className="inline-flex shrink-0 items-center rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  >
                    LinkedIn
                  </a>
                </nav>
              </div>
            </div>
          </section>

          <section id="blog" aria-labelledby="blog-heading">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="blog-heading" className="text-lg font-medium">
                Son Yazı
              </h2>
              <Link
                href="/blogs"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
              >
                Tümünü gör
              </Link>
            </div>
            <BlogTransitionLink href={`/blogs/${latestPost.slug}`} className="blog-card group">
              <span className="z-10">
                <span className="flex items-center gap-2">
                  <span style={{ viewTransitionName: `blog-title-${latestPost.slug}` }}>
                    {latestPost.title}
                  </span>
                  <ArrowUpRight className="size-4 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="mt-1 block text-zinc-500 dark:text-zinc-400">{latestPost.excerpt}</span>
              </span>
            </BlogTransitionLink>
          </section>
        </main>
        <SiteFooter languageHref="/" languageLabel="English" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </div>
  );
}
