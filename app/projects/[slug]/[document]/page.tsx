import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { projectLegalDocuments } from "../../../data/project-legal";
import { getProject, projects } from "../../../data/projects";
import { absoluteUrl } from "../../../lib/seo";

type LegalPageProps = { params: Promise<{ slug: string; document: string }> };

export function generateStaticParams() {
  return projects.flatMap((project) => project.legal ? ["privacy", "terms"].map((document) => ({ slug: project.slug, document })) : []);
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug, document } = await params;
  const project = getProject(slug);
  const legal = projectLegalDocuments[slug]?.[document as "privacy" | "terms"];
  if (!project || !legal) return {};
  const path = `/projects/${slug}/${document}`;
  return { title: `${legal.title} · ${project.title}`, description: legal.introduction, alternates: { canonical: absoluteUrl(path) } };
}

export default async function ProjectLegalPage({ params }: LegalPageProps) {
  const { slug, document } = await params;
  const project = getProject(slug);
  const legal = projectLegalDocuments[slug]?.[document as "privacy" | "terms"];
  if (!project || !legal || (document !== "privacy" && document !== "terms")) notFound();

  return (
    <main className="mx-auto min-h-screen w-full max-w-screen-sm px-4 py-16 sm:py-20">
      <Link href={`/projects/${slug}`} className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"><ArrowLeft className="size-4" />{project.title}</Link>
      <article className="legal-document mt-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">{project.title}</p>
        <h1>{legal.title}</h1>
        <p className="legal-date">{legal.effectiveDate}</p>
        <p className="legal-introduction">{legal.introduction}</p>
        {legal.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.items ? <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}
          </section>
        ))}
      </article>
    </main>
  );
}
