import { notFound } from "next/navigation";
import { BlogsIndexView, blogPagedStaticParams, createBlogsIndexMetadata, isBlogIndexPage } from "../../../../components/blogs-index-view";

type BlogPagedProps = {
  params: Promise<{ page: string }>;
};

export function generateStaticParams() {
  return blogPagedStaticParams("tr");
}

export async function generateMetadata({ params }: BlogPagedProps) {
  const page = Number((await params).page);
  if (!isBlogIndexPage("tr", page)) return {};
  return createBlogsIndexMetadata("tr", page);
}

export default async function BlogPagedPage({ params }: BlogPagedProps) {
  const page = Number((await params).page);
  if (!isBlogIndexPage("tr", page)) notFound();
  return <BlogsIndexView locale="tr" page={page} />;
}
