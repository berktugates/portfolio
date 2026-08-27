import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { BlogTransitionLink } from "./blog-transition-link";
import { GitHubActivity } from "./github-activity";
import { GlowCard } from "./glow-card";
import { LanguageSwitcher } from "./language-switcher";
import { ProjectsCarousel } from "./projects-carousel";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { getLocalizedBlogPosts, getLocalizedProjects } from "../lib/content/get-content";
import { blogPostPath, blogsIndexPath, projectPath } from "../lib/content/paths";
import {
  type Locale,
  getDictionary,
  hreflangLanguages,
  localeMeta,
  localePath,
  localeUrl,
} from "../lib/i18n";
import { AUTHOR_ID, SITE_LAST_MODIFIED, SITE_NAME, WEBSITE_ID, jsonLd } from "../lib/seo";

function ArrowIcon() {
  return (
    <ArrowUpRight
      aria-hidden="true"
      className="size-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    />
  );
}

export async function createHomeMetadata(locale: Locale): Promise<Metadata> {
  const dict = await getDictionary(locale);
  const meta = localeMeta[locale];
  const url = localeUrl(locale);

  return {
    title: { absolute: dict.metaTitle },
    description: dict.metaDescription,
    alternates: {
      canonical: url,
      languages: hreflangLanguages(),
    },
    openGraph: {
      type: "profile",
      locale: meta.ogLocale,
      url,
      siteName: SITE_NAME,
      title: dict.metaTitle,
      description: dict.metaDescription,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: dict.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metaTitle,
      description: dict.metaDescription,
      images: ["/opengraph-image"],
    },
  };
}

export async function HomePage({ locale }: { locale: Locale }) {
  const [dict, localizedProjects, localizedPosts] = await Promise.all([
    getDictionary(locale),
    getLocalizedProjects(locale),
    getLocalizedBlogPosts(locale),
  ]);
  const meta = localeMeta[locale];
  const latestPost = localizedPosts[0];
  const homeHref = localePath(locale);
  const cjk = locale === "zh" || locale === "ja";
  const carouselProjects = localizedProjects.map((project) => ({
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    image: project.image,
    imageAlt: project.imageAlt,
    visualClassName: project.visualClassName,
    href: projectPath(locale, project.slug),
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${localeUrl(locale)}#profile-page`,
    url: localeUrl(locale),
    name: dict.metaTitle,
    description: dict.metaDescription,
    inLanguage: meta.htmlLang,
    dateModified: SITE_LAST_MODIFIED,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": AUTHOR_ID },
  };

  return (
    <div
      lang={meta.htmlLang}
      dir={meta.dir}
      className={`flex min-h-screen w-full flex-col${cjk ? " font-sans tracking-normal" : ""}`}
      style={
        cjk
          ? {
              fontFamily:
                'system-ui, -apple-system, "Segoe UI", "PingFang SC", "Hiragino Sans", "Noto Sans SC", "Noto Sans JP", "Microsoft YaHei", sans-serif',
            }
          : undefined
      }
    >
      <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
        <SiteHeader
          homeHref={homeHref}
          name={dict.headerName}
          role={dict.headerRole}
          ariaLabel={dict.headerAriaLabel}
          imageAlt={dict.headerImageAlt}
        />
        <main className="space-y-24">
          <section aria-labelledby="intro-title">
            <h1 id="intro-title" className="sr-only">
              {dict.h1}
            </h1>
            <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{dict.intro}</p>
          </section>

          <section aria-labelledby="products-heading">
            <h2 id="products-heading" className="section-title">
              {dict.products}
            </h2>
            <ProjectsCarousel
              projects={carouselProjects}
              labels={{
                ariaLabel: dict.productsAria,
                selectLabel: dict.carousel.select,
                showProject: dict.carousel.showProject,
              }}
            />
          </section>

          <section aria-labelledby="experience-heading">
            <h2 id="experience-heading" className="section-title">
              {dict.experience}
            </h2>
            <div className="space-y-2">
              <GlowCard href="https://figtures.com">
                <span className="flex min-h-12 w-full items-start justify-between gap-4">
                  <span className="flex items-start gap-3">
                    <span className="mt-1 grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-900 transition-colors duration-200 group-hover:bg-zinc-800">
                      <Image
                        src="/figtures-logo.webp"
                        alt={dict.figturesLogoAlt}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span>
                      <span className="block">{dict.coFounder}</span>
                      <span className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                        {dict.figturesLine}{" "}
                        <ArrowUpRight className="hidden size-4 shrink-0 text-zinc-400 transition-all delay-100 duration-200 group-hover:block group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                      </span>
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-sm text-zinc-600 dark:text-zinc-400 sm:block">
                    {dict.figturesPeriod}
                  </span>
                </span>
              </GlowCard>
              <GlowCard href="https://www.bradi.tech">
                <span className="flex min-h-12 w-full items-start justify-between gap-4">
                  <span className="flex items-start gap-3">
                    <span className="mt-1 grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-100 transition-colors duration-200 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                      <Image
                        src="/bradi-logo.webp"
                        alt={dict.bradiLogoAlt}
                        width={40}
                        height={40}
                        className="h-full w-full object-contain p-1"
                      />
                    </span>
                    <span>
                      <span className="block">{dict.engineer}</span>
                      <span className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                        {dict.bradiLine}{" "}
                        <ArrowUpRight className="hidden size-4 shrink-0 text-zinc-400 transition-all delay-100 duration-200 group-hover:block group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                      </span>
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-sm text-zinc-600 dark:text-zinc-400 sm:block">
                    {dict.bradiPeriod}
                  </span>
                </span>
              </GlowCard>
            </div>
            <GitHubActivity
              copy={{
                ...dict.github,
                dateLocale: meta.htmlLang,
              }}
            />
          </section>

          <section aria-labelledby="education-heading">
            <h2 id="education-heading" className="section-title">
              {dict.education}
            </h2>
            <GlowCard>
              <span className="flex min-h-12 w-full items-start justify-between gap-4">
                <span className="flex items-start gap-3">
                  <span className="mt-1 grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-100 transition-colors duration-200 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                    <Image
                      src="/firat-university.webp"
                      alt={dict.universityLogoAlt}
                      width={40}
                      height={40}
                      className="h-full w-full object-contain p-1"
                    />
                  </span>
                  <span>
                    <span className="block">{dict.degree}</span>
                    <span className="block text-zinc-500 dark:text-zinc-400">{dict.university}</span>
                  </span>
                </span>
                <span className="hidden shrink-0 text-sm text-zinc-600 dark:text-zinc-400 sm:block">
                  {dict.educationPeriod}
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
                    {dict.contact}
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{dict.contactBody}</p>
                </div>
                <GlowCard href="mailto:contact@berktugberke.com">
                  <span className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-zinc-100 transition-colors group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                      <Mail className="size-5 text-zinc-700 dark:text-zinc-300" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {dict.emailMe}
                      </span>
                      <span className="block text-xs text-zinc-600 dark:text-zinc-400">
                        contact@berktugberke.com
                      </span>
                    </span>
                    <ArrowIcon />
                  </span>
                </GlowCard>
                <nav aria-label={dict.socialNav} className="flex flex-wrap gap-2">
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
                {dict.latestBlog}
              </h2>
              <Link
                href={blogsIndexPath(locale)}
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
              >
                {dict.viewAll}
              </Link>
            </div>
            <BlogTransitionLink href={blogPostPath(locale, latestPost.slug)} className="blog-card group">
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
        <SiteFooter>
          <LanguageSwitcher locale={locale} />
        </SiteFooter>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </div>
  );
}
