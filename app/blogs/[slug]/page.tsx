import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { BlogShare } from "../../components/blog-share";
import { CopyUrl } from "../../components/copy-url";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { blogPosts, getBlogPost } from "../../data/blogs";

export const dynamicParams = false;
type BlogPageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}
const date = (value: string) =>
  new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(value));

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: [...post.keywords],
    authors: [{ name: "Berktug Berke Ates", url: "https://berktugberke.com" }],
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blogs/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: ["Berktug Berke Ates"],
      tags: [...post.keywords],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: `https://berktugberke.com/blogs/${post.slug}`,
    keywords: post.keywords.join(", "),
    timeRequired: `PT${post.readingMinutes}M`,
    author: { "@type": "Person", name: "Berktug Berke Ates", url: "https://berktugberke.com" },
    publisher: { "@type": "Person", name: "Berktug Berke Ates" },
  };
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-screen-sm px-4 pt-20">
      <SiteHeader />
      <div className="absolute right-4 top-24">
        <CopyUrl />
      </div>
      <main className="blog-prose mt-12 pb-20">
        <Link
          href="/blogs"
          className="mb-12 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
        >
          <ArrowLeft className="size-4" />
          Blogs
        </Link>
        <article>
          <header className="mb-10">
            <h1 style={{ viewTransitionName: `blog-title-${post.slug}` }}>{post.title}</h1>
            <p className="!my-0 text-sm text-zinc-500 dark:text-zinc-400">
              <time dateTime={post.publishedAt}>{date(post.publishedAt)}</time> · {post.readingMinutes} min read
            </p>
            <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
            <BlogShare title={post.title} slug={post.slug} />
          </header>
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.points ? (
                <ul>
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          <hr />
          <p>
            <em>
              Published on {date(post.publishedAt)} by Berktug Berke Ates.
            </em>
          </p>
        </article>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
