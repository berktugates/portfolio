import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react";
import { GlowCard } from "./glow-card";
import { LanguageSwitcher } from "./language-switcher";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { getLocaleContent, getLocalizedProjects } from "../lib/content/get-content";
import { hirePath, pathHreflangLanguages, projectPath } from "../lib/content/paths";
import { type Locale, getDictionary, localeMeta, localePath } from "../lib/i18n";
import {
  AUTHOR_ID,
  CONTACT_EMAIL,
  GITHUB_PROFILE,
  LINKEDIN_PROFILE,
  SITE_LAST_MODIFIED,
  SITE_NAME,
  WEBSITE_ID,
  absoluteUrl,
  jsonLd,
} from "../lib/seo";

function ArrowIcon() {
  return (
    <ArrowUpRight
      aria-hidden="true"
      className="size-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    />
  );
}

export async function createHireMetadata(locale: Locale): Promise<Metadata> {
  const dict = await getDictionary(locale);
  const meta = localeMeta[locale];
  const canonical = absoluteUrl(hirePath(locale));

  return {
    title: { absolute: dict.hire.metaTitle },
    description: dict.hire.metaDescription,
    alternates: {
      canonical,
      languages: pathHreflangLanguages("/hire"),
    },
    openGraph: {
      type: "website",
      locale: meta.ogLocale,
      url: canonical,
      siteName: SITE_NAME,
      title: dict.hire.metaTitle,
      description: dict.hire.metaDescription,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: dict.hire.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.hire.metaTitle,
      description: dict.hire.metaDescription,
      images: ["/opengraph-image"],
    },
  };
}

export async function HirePage({ locale }: { locale: Locale }) {
  const [dict, content, localizedProjects] = await Promise.all([
    getDictionary(locale),
    getLocaleContent(locale),
    getLocalizedProjects(locale),
  ]);
  const meta = localeMeta[locale];
  const homeHref = localePath(locale);
  const pageUrl = absoluteUrl(hirePath(locale));
  const cjk = locale === "zh" || locale === "ja";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: dict.hire.metaTitle,
        description: dict.hire.metaDescription,
        inLanguage: meta.htmlLang,
        dateModified: SITE_LAST_MODIFIED,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": AUTHOR_ID },
        about: { "@id": AUTHOR_ID },
        hasPart: { "@id": `${pageUrl}#faq` },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        url: `${pageUrl}#faq`,
        inLanguage: meta.htmlLang,
        isPartOf: { "@id": `${pageUrl}#webpage` },
        mainEntity: dict.hire.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
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
        <main className="space-y-16 pb-8">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="size-4" />
            {content.ui.back}
          </Link>

          <section aria-labelledby="hire-title">
            <h1 id="hire-title" className="text-2xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50">
              {dict.hire.h1}
            </h1>
            <p className="mt-4 leading-relaxed text-zinc-700 dark:text-zinc-300">{dict.hire.lead}</p>
          </section>

          <section aria-labelledby="availability-heading">
            <h2 id="availability-heading" className="section-title">
              {dict.hire.availabilityHeading}
            </h2>
            <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{dict.hire.availabilityBody}</p>
          </section>

          <section aria-labelledby="work-heading">
            <h2 id="work-heading" className="section-title">
              {dict.hire.workHeading}
            </h2>
            <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{dict.hire.workBody}</p>
            <h3 className="mt-8 mb-5 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {dict.hire.productsHeading}
            </h3>
            <ul className="space-y-2">
              {localizedProjects.map((project) => (
                <li key={project.slug}>
                  <GlowCard href={projectPath(locale, project.slug)}>
                    <span className="flex items-start justify-between gap-4">
                      <span>
                        <span className="block">{project.title}</span>
                        <span className="block text-zinc-500 dark:text-zinc-400">{project.summary}</span>
                      </span>
                      <ArrowIcon />
                    </span>
                  </GlowCard>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="how-heading">
            <div className="rounded-2xl bg-zinc-50/40 p-6 ring-1 ring-inset ring-zinc-200/50 dark:bg-zinc-950/40 dark:ring-zinc-800/50">
              <div className="flex h-full flex-col justify-between space-y-6">
                <div>
                  <h2
                    id="how-heading"
                    className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-100"
                  >
                    {dict.hire.howHeading}
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{dict.hire.howBody}</p>
                </div>
                <GlowCard href={`mailto:${CONTACT_EMAIL}`}>
                  <span className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-zinc-100 transition-colors group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                      <Mail className="size-5 text-zinc-700 dark:text-zinc-300" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {dict.emailMe}
                      </span>
                      <span className="block text-xs text-zinc-600 dark:text-zinc-400">{CONTACT_EMAIL}</span>
                    </span>
                    <ArrowIcon />
                  </span>
                </GlowCard>
                <nav aria-label={dict.socialNav} className="flex flex-wrap gap-2">
                  <a
                    href={GITHUB_PROFILE}
                    target="_blank"
                    rel="me noreferrer"
                    className="inline-flex shrink-0 items-center rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  >
                    GitHub
                  </a>
                  <a
                    href={LINKEDIN_PROFILE}
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

          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="section-title">
              {dict.hire.faqHeading}
            </h2>
            <dl className="space-y-8">
              {dict.hire.faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-medium text-zinc-950 dark:text-zinc-50">{faq.question}</dt>
                  <dd className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">{faq.answer}</dd>
                </div>
              ))}
            </dl>
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
