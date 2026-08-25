import { notFound } from "next/navigation";
import { BlogsIndexView, createBlogsIndexMetadata } from "../../../../components/blogs-index-view";
import { getBlogTotalPages } from "../../../../data/blogs";

type BlogPagedProps = {
  params: Promise<{ page: string }>;
};

export function generateStaticParams() {
  const totalPages = getBlogTotalPages();
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({ params }: BlogPagedProps) {
  const page = Number((await params).page);
  if (!Number.isInteger(page) || page < 2 || page > getBlogTotalPages()) return {};
  return createBlogsIndexMetadata("it", page);
}

export default async function BlogPagedPage({ params }: BlogPagedProps) {
  const page = Number((await params).page);
  const totalPages = getBlogTotalPages();
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();
  return <BlogsIndexView locale="it" page={page} />;
}
