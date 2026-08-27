import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { projects } from "../data/projects";
import { getLocaleContent, getLocalizedProject } from "../lib/content/get-content";
import {
  projectLegalPath,
  projectPath,
  type ProjectLegalDocument,
} from "../lib/content/paths";
import type { Locale } from "../lib/i18n";
import {
  LOCALES,
  getDictionary,
  localeMeta,
  localePath,
} from "../lib/i18n";
import { absoluteUrl } from "../lib/seo";
import { LanguageSwitcher } from "./language-switcher";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type LegalPageProps = {
  params: Promise<{ slug: string; document: string }>;
};

function isLegalDocument(value: string): value is ProjectLegalDocument {
  return value === "privacy" || value === "terms";
}

export function projectLegalStaticParams() {
  return projects.flatMap((project) =>
    project.legal
      ? (["privacy", "terms"] as const).map((document) => ({
          slug: project.slug,
          document,
        }))
      : [],
  );
}

export async function createProjectLegalMetadata(
  locale: Locale,
  { params }: LegalPageProps,
): Promise<Metadata> {
  const { slug, document } = await params;
  if (!isLegalDocument(document)) return {};
  const [project, content] = await Promise.all([
    getLocalizedProject(locale, slug),
    getLocaleContent(locale),
  ]);
  const legal = content.legal[slug]?.[document];
  if (!project || !legal) return {};

  const path = projectLegalPath(locale, slug, document);
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(projectLegalPath("en", slug, document)),
  };
  for (const item of LOCALES) {
    languages[localeMeta[item].hreflang] = absoluteUrl(
      projectLegalPath(item, slug, document),
    );
  }

  return {
    title: `${legal.title} · ${project.title}`,
    description: legal.introduction,
    alternates: { canonical: absoluteUrl(path), languages },
    openGraph: {
      type: "website",
      locale: localeMeta[locale].ogLocale,
      title: `${legal.title} · ${project.title}`,
      description: legal.introduction,
      url: path,
    },
  };
}

export async function ProjectLegalPage({
  locale,
  params,
}: {
  locale: Locale;
  params: LegalPageProps["params"];
}) {
  const { slug, document } = await params;
  if (!isLegalDocument(document)) notFound();

  const [project, content, dict] = await Promise.all([
    getLocalizedProject(locale, slug),
    getLocaleContent(locale),
    getDictionary(locale),
  ]);
  const legal = content.legal[slug]?.[document];
  if (!project || !legal || !project.legal) notFound();

  const meta = localeMeta[locale];
  const homeHref = localePath(locale);
  return (
    <div lang={meta.htmlLang} dir={meta.dir} className="flex min-h-screen w-full flex-col">
      <div className="relative mx-auto flex min-h-screen w-full max-w-screen-sm flex-col px-4 pt-20">
        <SiteHeader
          homeHref={homeHref}
          name={dict.headerName}
          role={dict.headerRole}
          ariaLabel={dict.headerAriaLabel}
          imageAlt={dict.headerImageAlt}
        />
        <main className="flex-1 pb-16 pt-4">
          <Link
            href={projectPath(locale, slug)}
            className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="size-4" />
            {content.ui.back}
          </Link>
          <article className="legal-document mt-10">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              {project.title}
            </p>
            <h1>{legal.title}</h1>
            <p className="legal-date">{legal.effectiveDate}</p>
            <p className="legal-introduction">{legal.introduction}</p>
            {legal.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.items ? (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </article>
        </main>
        <SiteFooter>
          <LanguageSwitcher locale={locale} />
        </SiteFooter>
      </div>
    </div>
  );
}
