import type { Metadata } from "next";
import { BlogsIndex, blogsIndexMetadata } from "./blogs-index";

export const metadata: Metadata = blogsIndexMetadata(1);

export default function BlogsPage() {
  return <BlogsIndex page={1} />;
}
