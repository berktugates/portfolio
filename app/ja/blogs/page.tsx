import { BlogsIndexView, createBlogsIndexMetadata } from "../../components/blogs-index-view";

export async function generateMetadata() {
  return createBlogsIndexMetadata("ja", 1);
}

export default function BlogsPage() {
  return <BlogsIndexView locale="ja" page={1} />;
}
