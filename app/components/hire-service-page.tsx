import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { hirePath, hireServicePath, pathHreflangLanguages } from "../lib/content/paths";
import {
  assertServiceParam,
  getHireServicePageCopy,
  relatedServiceSlugs,
} from "../lib/hire-service-page-content";
import { type Locale, getDictionary, localeMeta, localePath } from "../lib/i18n";
import {
  AUTHOR_ID,
  AREA_SERVED,
  CONTACT_EMAIL,
  SITE_LAST_MODIFIED,
  SITE_NAME,
  WEBSITE_ID,
  absoluteUrl,
  jsonLd,
} from "../lib/seo";
import {
  SERVICE_OFFERS,
  SERVICE_SLUGS,
  serviceEntityId,
  serviceOfferId,
  type ServiceSlug,
} from "../lib/services";

export function hireServiceStaticParams() {
  return SERVICE_SLUGS.map((service) => ({ service }));
}

type HireServicePageProps = { params: Promise<{ service: string }> };

export async function createHireServiceMetadata(locale: Locale, props: HireServicePageProps): Promise<Metadata> {
  const { service: raw } = await props.params;
  const slug = assertServiceParam(raw);
  const copy = getHireServicePageCopy(locale, slug);
  const meta = localeMeta[locale];
  const canonical = absoluteUrl(hireServicePath(locale, slug));

  return {
    title: { absolute: copy.metaTitle },
    description: copy.metaDescription,
    alternates: {
      canonical,
      languages: pathHreflangLanguages(`/hire/${slug}`),
    },
    openGraph: {
      type: "website",
      locale: meta.ogLocale,
      url: canonical,
      siteName: SITE_NAME,
      title: copy.metaTitle,
      description: copy.metaDescription,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: copy.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metaTitle,
      description: copy.metaDescription,
      images: ["/opengraph-image"],
    },
  };
}

export async function HireServicePage({
  locale,
  params,
}: {
  locale: Locale;
  params: Promise<{ service: string }>;
}) {
  const { service: raw } = await params;
  const slug = assertServiceParam(raw);
  const [dict, copy] = await Promise.all([
    getDictionary(locale),
    Promise.resolve(getHireServicePageCopy(locale, slug)),
  ]);
  const meta = localeMeta[locale];
  const homeHref = localePath(locale);
  const pageUrl = absoluteUrl(hireServicePath(locale, slug));
  const hireIndexUrl = absoluteUrl(hirePath(locale));
  const cjk = locale === "zh" || locale === "ja";
  const related = relatedServiceSlugs(slug).map((relatedSlug) => {
    const relatedCopy = getHireServicePageCopy(locale, relatedSlug);
    return { slug: relatedSlug as ServiceSlug, title: relatedCopy.title };
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: copy.metaTitle,
        description: copy.metaDescription,
        inLanguage: meta.htmlLang,
        dateModified: SITE_LAST_MODIFIED,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": serviceEntityId(slug) },
        mainEntity: { "@id": serviceOfferId(slug) },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE_NAME,
            item: absoluteUrl(homeHref === "/" ? "/" : homeHref),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: dict.hire.servicesHeading,
            item: hireIndexUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: copy.title,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Offer",
        "@id": serviceOfferId(slug),
        name: copy.title,
        description: copy.description,
        url: pageUrl,
        offeredBy: { "@id": AUTHOR_ID },
        areaServed: AREA_SERVED,
        itemOffered: {
          "@type": "Service",
          "@id": serviceEntityId(slug),
          name: copy.title,
          description: copy.description,
          serviceType: copy.title,
          provider: { "@id": AUTHOR_ID },
          areaServed: AREA_SERVED,
          url: pageUrl,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        url: pageUrl,
        inLanguage: meta.htmlLang,
        isPartOf: { "@id": `${pageUrl}#webpage` },
        mainEntity: copy.faqs.map((faq) => ({
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
            href={hirePath(locale)}
            className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="size-4" />
            {copy.backToHire}
          </Link>

          <section aria-labelledby="service-title">
            <h1 id="service-title" className="text-2xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50">
              {copy.h1}
            </h1>
            <p className="mt-4 leading-relaxed text-zinc-700 dark:text-zinc-300">{copy.lead}</p>
          </section>

          {copy.sections.map((section) => (
            <section key={section.heading} aria-labelledby={`section-${section.heading}`}>
              <h2 id={`section-${section.heading}`} className="section-title">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="mt-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {paragraph}
                </p>
              ))}
              {section.points ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section aria-labelledby="regions-heading">
            <h2 id="regions-heading" className="section-title">
              {copy.regionsHeading}
            </h2>
            <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{copy.regionsBody}</p>
          </section>

          <section aria-labelledby="how-heading">
            <h2 id="how-heading" className="section-title">
              {copy.howHeading}
            </h2>
            <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{copy.howBody}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-950 dark:text-zinc-50"
            >
              <Mail className="size-4" />
              {CONTACT_EMAIL}
            </a>
          </section>

          <section aria-labelledby="service-faq-heading">
            <h2 id="service-faq-heading" className="section-title">
              {dict.hire.faqHeading}
            </h2>
            <dl className="mt-4 space-y-6">
              {copy.faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{faq.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="section-title">
              {copy.relatedHeading}
            </h2>
            <ul className="mt-4 space-y-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={hireServicePath(locale, item.slug)}
                    className="text-sm text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-zinc-500">
              <Link href={hirePath(locale)} className="underline-offset-4 hover:underline">
                {copy.backToHire}
              </Link>
              {" · "}
              {SERVICE_OFFERS.length} services
            </p>
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
