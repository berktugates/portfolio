import { notFound } from "next/navigation";
import { BlogsIndexView, blogPagedStaticParams, createBlogsIndexMetadata, isBlogIndexPage } from "../../../components/blogs-index-view";

type BlogPagedProps = {
  params: Promise<{ page: string }>;
};

export function generateStaticParams() {
  return blogPagedStaticParams("en");
}

export async function generateMetadata({ params }: BlogPagedProps) {
  const page = Number((await params).page);
  if (!isBlogIndexPage("en", page)) return {};
  return createBlogsIndexMetadata("en", page);
}

export default async function BlogPagedPage({ params }: BlogPagedProps) {
  const page = Number((await params).page);
  if (!isBlogIndexPage("en", page)) notFound();
  return <BlogsIndexView locale="en" page={page} />;
}
