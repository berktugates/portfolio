import { BlogsIndexView, createBlogsIndexMetadata } from "../../components/blogs-index-view";

export async function generateMetadata() {
  return createBlogsIndexMetadata("it", 1);
}

export default function BlogsPage() {
  return <BlogsIndexView locale="it" page={1} />;
}
