import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { GitHubActivity } from "./components/github-activity";
import { GlowCard } from "./components/glow-card";
import { BlogTransitionLink } from "./components/blog-transition-link";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { ProjectsCarousel } from "./components/projects-carousel";
import { sortedBlogPosts } from "./data/blogs";
import { SITE_INTRO } from "./lib/seo";

function ArrowIcon() {
  return (
    <ArrowUpRight
      aria-hidden="true"
      className="size-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    />
  );
}

export default function Home() {
  const latestPost = sortedBlogPosts[0];
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
        <SiteHeader />
        <main className="space-y-24">
          <section aria-labelledby="intro-title">
            <h1 id="intro-title" className="sr-only">
              Berktug Berke Ates — Software Engineer and Product Builder
            </h1>
            <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
              {SITE_INTRO}
            </p>
          </section>

          <section aria-labelledby="products-heading">
            <h2 id="products-heading" className="section-title">
              Products
            </h2>
            <ProjectsCarousel />
          </section>

          <section aria-labelledby="experience-heading">
            <h2 id="experience-heading" className="section-title">
              Work Experience
            </h2>
            <div className="space-y-2">
              <GlowCard
                href="https://figtures.com"
                label="Co-Founder at Figtures"
              >
                <span className="flex min-h-12 w-full items-start justify-between gap-4">
                  <span className="flex items-start gap-3">
                    <span className="mt-1 grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-900 transition-colors duration-200 group-hover:bg-zinc-800">
                      <Image
                        src="/figtures-logo.png"
                        alt="Figtures logo"
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span>
                      <span className="block">Co-Founder</span>
                      <span className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                        Figtures · Istanbul{" "}
                        <ArrowUpRight className="hidden size-4 shrink-0 text-zinc-400 transition-all delay-100 duration-200 group-hover:block group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                      </span>
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-sm text-zinc-600 dark:text-zinc-400 sm:block">
                    Mar 2026 – Present
                  </span>
                </span>
              </GlowCard>
              <GlowCard
                href="https://www.bradi.tech"
                label="Full-stack Software Engineer at bradi.tech"
              >
                <span className="flex min-h-12 w-full items-start justify-between gap-4">
                  <span className="flex items-start gap-3">
                    <span className="mt-1 grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-100 transition-colors duration-200 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                      <Image
                        src="/bradi-logo.png"
                        alt="bradi.tech logo"
                        width={40}
                        height={40}
                        className="h-full w-full object-contain p-1"
                      />
                    </span>
                    <span>
                      <span className="block">
                        Full-stack Software Engineer
                      </span>
                      <span className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                        bradi.tech · London{" "}
                        <ArrowUpRight className="hidden size-4 shrink-0 text-zinc-400 transition-all delay-100 duration-200 group-hover:block group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                      </span>
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-sm text-zinc-600 dark:text-zinc-400 sm:block">
                    Nov 2024 – Present
                  </span>
                </span>
              </GlowCard>
            </div>
            <GitHubActivity />
          </section>

          <section aria-labelledby="education-heading">
            <h2 id="education-heading" className="section-title">
              Education
            </h2>
            <GlowCard>
              <span className="flex min-h-12 w-full items-start justify-between gap-4">
                <span className="flex items-start gap-3">
                  <span className="mt-1 grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-100 transition-colors duration-200 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                    <Image
                      src="/firat-university.png"
                      alt="Fırat University logo"
                      width={40}
                      height={40}
                      className="h-full w-full object-contain p-1"
                    />
                  </span>
                  <span>
                    <span className="block">B.Sc. Software Engineering</span>
                    <span className="block text-zinc-500 dark:text-zinc-400">
                      Fırat University
                    </span>
                  </span>
                </span>
                <span className="hidden shrink-0 text-sm text-zinc-600 dark:text-zinc-400 sm:block">
                  2020 – 2025
                </span>
              </span>
            </GlowCard>
          </section>

          <section aria-labelledby="contact-heading">
            <div className="rounded-2xl bg-zinc-50/40 p-6 ring-1 ring-inset ring-zinc-200/50 dark:bg-zinc-950/40 dark:ring-zinc-800/50">
              <div className="flex h-full flex-col justify-between space-y-6">
                <div>
                  <h2
                    id="contact-heading"
                    className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-100"
                  >
                    Get in Touch
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Have a project in mind or simply want to connect? I&apos;m
                    always open to thoughtful conversations and meaningful
                    collaborations.
                  </p>
                </div>
                <GlowCard
                  href="mailto:contact@berktugberke.com"
                  label="Email Berktug Berke Ates"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-zinc-100 transition-colors group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                      <Mail className="size-5 text-zinc-700 dark:text-zinc-300" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Email me
                      </span>
                      <span className="block text-xs text-zinc-600 dark:text-zinc-400">
                        contact@berktugberke.com
                      </span>
                    </span>
                    <ArrowIcon />
                  </span>
                </GlowCard>
                <nav
                  aria-label="Social profiles"
                  className="flex flex-wrap gap-2"
                >
                  <a
                    href="https://github.com/berktugates"
                    target="_blank"
                    rel="me noreferrer"
                    className="inline-flex shrink-0 items-center rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/berktugates/"
                    target="_blank"
                    rel="me noreferrer"
                    className="inline-flex shrink-0 items-center rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  >
                    LinkedIn
                  </a>
                </nav>
              </div>
            </div>
          </section>

          <section id="blog" aria-labelledby="blog-heading">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="blog-heading" className="text-lg font-medium">
                Latest Blog
              </h2>
              <Link
                href="/blogs"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
              >
                View all
              </Link>
            </div>
            <BlogTransitionLink href={`/blogs/${latestPost.slug}`} className="blog-card group">
              <span className="z-10">
                <span className="flex items-center gap-2">
                  <span style={{ viewTransitionName: `blog-title-${latestPost.slug}` }}>
                    {latestPost.title}
                  </span>
                  <ArrowUpRight className="size-4 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="mt-1 block text-zinc-500 dark:text-zinc-400">
                  {latestPost.excerpt}
                </span>
              </span>
            </BlogTransitionLink>
          </section>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
