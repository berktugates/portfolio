import { BlogsIndexView, createBlogsIndexMetadata } from "../../components/blogs-index-view";

export async function generateMetadata() {
  return createBlogsIndexMetadata("zh", 1);
}

export default function BlogsPage() {
  return <BlogsIndexView locale="zh" page={1} />;
}
