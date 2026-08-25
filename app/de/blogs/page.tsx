import { BlogsIndexView, createBlogsIndexMetadata } from "../../components/blogs-index-view";

export async function generateMetadata() {
  return createBlogsIndexMetadata("de", 1);
}

export default function BlogsPage() {
  return <BlogsIndexView locale="de" page={1} />;
}
