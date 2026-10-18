import { notFound } from "next/navigation";
import { BlogsIndexView, blogPagedStaticParams, createBlogsIndexMetadata, isBlogIndexPage } from "../../../../components/blogs-index-view";

type BlogPagedProps = {
  params: Promise<{ page: string }>;
};

export function generateStaticParams() {
  return blogPagedStaticParams("ja");
}

export async function generateMetadata({ params }: BlogPagedProps) {
  const page = Number((await params).page);
  if (!isBlogIndexPage("ja", page)) return {};
  return createBlogsIndexMetadata("ja", page);
}

export default async function BlogPagedPage({ params }: BlogPagedProps) {
  const page = Number((await params).page);
  if (!isBlogIndexPage("ja", page)) notFound();
  return <BlogsIndexView locale="ja" page={page} />;
}
