import { notFound } from "next/navigation";
import { BlogsIndexView, blogPagedStaticParams, createBlogsIndexMetadata, isBlogIndexPage } from "../../../../components/blogs-index-view";

type BlogPagedProps = {
  params: Promise<{ page: string }>;
};

export function generateStaticParams() {
  return blogPagedStaticParams("zh");
}

export async function generateMetadata({ params }: BlogPagedProps) {
  const page = Number((await params).page);
  if (!isBlogIndexPage("zh", page)) return {};
  return createBlogsIndexMetadata("zh", page);
}

export default async function BlogPagedPage({ params }: BlogPagedProps) {
  const page = Number((await params).page);
  if (!isBlogIndexPage("zh", page)) notFound();
  return <BlogsIndexView locale="zh" page={page} />;
}
