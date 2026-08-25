import { BlogsIndexView, createBlogsIndexMetadata } from "../../components/blogs-index-view";

export async function generateMetadata() {
  return createBlogsIndexMetadata("fr", 1);
}

export default function BlogsPage() {
  return <BlogsIndexView locale="fr" page={1} />;
}
