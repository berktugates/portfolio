import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { BlogTransitionLink } from "../components/blog-transition-link";

export const metadata: Metadata = { title: "Blogs", description: "Notes on software engineering, products and technology by Berktug Berke Ates.", alternates: { canonical: "/blogs" } };
export default function BlogsPage() { return <div className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col px-4 pt-20"><SiteHeader /><main className="flex-1"><h1 className="mb-3 text-xl font-medium">Blogs</h1><p className="mb-8 text-zinc-500 dark:text-zinc-400">Notes on software engineering, products and the things I learn along the way.</p><BlogTransitionLink className="blog-card group"><span className="z-10"><span className="flex items-center gap-2"><span style={{ viewTransitionName: "blog-title" }}>Hello World</span><ArrowUpRight className="size-4 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" /></span><span className="mt-1 block text-zinc-500 dark:text-zinc-400">My first blog post</span></span></BlogTransitionLink></main><SiteFooter /></div>; }
