/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { getProject, projects } from "../../data/projects";

export const dynamicParams = false;

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "website",
      title: project.title,
      description: project.description,
      url: `/projects/${project.slug}`,
      images: [{ url: project.image, alt: project.imageAlt }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    applicationCategory: "SoftwareApplication",
    url: project.href,
    author: { "@type": "Person", name: "Berktug Berke Ates" },
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="relative mx-auto flex min-h-screen w-full max-w-screen-sm flex-col px-4 pt-20">
        <SiteHeader />
        <main className="flex-1 pb-16 pt-4">
          <Link
            href="/"
            transitionTypes={["project-back"]}
            className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>

          <ViewTransition
            name={`project-${project.slug}`}
            share="project-morph"
            default="none"
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-50/40 p-1.5 ring-1 ring-inset ring-zinc-200/50 dark:bg-zinc-950/40 dark:ring-zinc-800/50">
              <div className={`project-visual relative flex h-full items-center justify-center overflow-hidden rounded-[11px] ${project.visualClassName}`}>
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  width={224}
                  height={224}
                  priority
                  className="size-44 rounded-[34px] object-cover shadow-2xl shadow-black/50 sm:size-56 sm:rounded-[44px]"
                />
              </div>
            </div>
          </ViewTransition>

          <div className="mt-5 flex flex-col items-start justify-between gap-4 sm:flex-row">
            <div>
              <h1 className="text-xl font-medium text-zinc-950 dark:text-zinc-50">
                {project.title}
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {project.period}
              </p>
            </div>
            {project.stores ? <div className="flex shrink-0 flex-wrap justify-start gap-2 sm:justify-end">
              {project.stores.apple ? <a href={project.stores.apple} target="_blank" rel="noreferrer" aria-label={`Download ${project.title} on the App Store`} className="store-badge-link">
                {/* Official Apple artwork, separate instances for both color modes. */}
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="store-badge light-store-badge" />
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="store-badge dark-store-badge" />
              </a> : null}
              {project.stores.google ? <a href={project.stores.google} target="_blank" rel="noreferrer" aria-label={`Get ${project.title} on Google Play`} className="store-badge-link">
                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="google-store-badge" />
              </a> : null}
            </div> : null}
          </div>

          <div className="mt-6 space-y-4 leading-7 text-zinc-600 dark:text-zinc-400">
            <p>{project.description}</p>
            {project.details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>

          <section className="mt-8" aria-labelledby="product-scope-heading">
            <h2
              id="product-scope-heading"
              className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500"
            >
              Product Scope
            </h2>
            <ul className="space-y-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-zinc-400" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8" aria-labelledby="tech-stack-heading">
            <h2
              id="tech-stack-heading"
              className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500"
            >
              Tech Stack
            </h2>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((technology) => (
                <li
                  key={technology}
                  className="rounded-md bg-zinc-100 px-2.5 py-1.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {technology}
                </li>
              ))}
            </ul>
          </section>
        </main>
        <SiteFooter />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
