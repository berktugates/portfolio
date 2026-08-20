import type { Metadata } from "next";
import { CopyUrl } from "../../components/copy-url";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";

export const metadata: Metadata = { title: "Hello World", description: "An introduction to Berktug Berke Ates's software engineering blog.", alternates: { canonical: "/blogs/hello-world" }, openGraph: { type: "article", title: "Hello World", description: "An introduction to my software engineering blog.", publishedTime: "2026-08-21" } };

export default function HelloWorldPage() {
  return <div className="relative mx-auto min-h-screen w-full max-w-screen-sm px-4 pt-20"><SiteHeader /><div className="absolute right-4 top-24"><CopyUrl /></div><main className="blog-prose mt-24 pb-20"><h1 style={{ viewTransitionName: "blog-title" }}>Hello World</h1><p>Welcome to my blog. This is where I&apos;ll share what I learn while building software and products.</p><p>I&apos;m a full-stack software engineer working with modern web technologies and exploring the intersection of AI and health tech. I also enjoy contributing to the developer community and combining technology with creativity.</p><h2>What to Expect</h2><p>In this blog, I&apos;ll be sharing:</p><ul><li>Technical insights and practical tutorials</li><li>Lessons from building full-stack products</li><li>Thoughts on software engineering, AI and health tech</li><li>Experiences and ideas I pick up along the way</li></ul><p>Stay tuned for more.</p><hr /><p><em>Published on August 21, 2026</em></p></main><SiteFooter /></div>;
}
