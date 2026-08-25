import {
  BlogDetailPage,
  blogStaticParams,
  createBlogMetadata,
} from "../../../components/blog-detail";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogStaticParams();
}

type BlogPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: BlogPageProps) {
  return createBlogMetadata("zh", props);
}

export default function BlogPage(props: BlogPageProps) {
  return <BlogDetailPage locale="zh" params={props.params} />;
}
