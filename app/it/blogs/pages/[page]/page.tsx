import { notFound } from "next/navigation";
import { BlogsIndexView, blogPagedStaticParams, createBlogsIndexMetadata, isBlogIndexPage } from "../../../../components/blogs-index-view";

type BlogPagedProps = {
  params: Promise<{ page: string }>;
};

export function generateStaticParams() {
  return blogPagedStaticParams("it");
}

export async function generateMetadata({ params }: BlogPagedProps) {
  const page = Number((await params).page);
  if (!isBlogIndexPage("it", page)) return {};
  return createBlogsIndexMetadata("it", page);
}

export default async function BlogPagedPage({ params }: BlogPagedProps) {
  const page = Number((await params).page);
  if (!isBlogIndexPage("it", page)) notFound();
  return <BlogsIndexView locale="it" page={page} />;
}
