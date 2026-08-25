import { BlogsIndexView, createBlogsIndexMetadata } from "../components/blogs-index-view";

export async function generateMetadata() {
  return createBlogsIndexMetadata("en", 1);
}

export default function BlogsPage() {
  return <BlogsIndexView locale="en" page={1} />;
}
