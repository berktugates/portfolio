import { BlogsIndexView, createBlogsIndexMetadata } from "../../components/blogs-index-view";

export async function generateMetadata() {
  return createBlogsIndexMetadata("tr", 1);
}

export default function BlogsPage() {
  return <BlogsIndexView locale="tr" page={1} />;
}
