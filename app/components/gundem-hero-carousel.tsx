"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { GundemCover } from "./gundem-cover";
import { formatGundemCategory, formatGundemDate } from "../lib/gundem/editorial";
import { haberlerArticlePath, haberlerUrl } from "../lib/gundem/hosts";
import type { GundemBriefing } from "../lib/gundem/types";

type GundemHeroCarouselProps = {
  posts: readonly GundemBriefing[];
  intervalMs?: number;
};

export function GundemHeroCarousel({ posts, intervalMs = 6000 }: GundemHeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = posts.length;
  const active = posts[index];

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count <= 1) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [count, intervalMs]);

  if (!active) return null;

  return (
    <section aria-labelledby="gundem-hero-heading" data-gundem-carousel>
      <h2 id="gundem-hero-heading" className="sr-only">
        Öne çıkan haberler
      </h2>
      <div className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-px dark:bg-zinc-600/30">
        <div className="overflow-hidden rounded-[15px] bg-white dark:bg-zinc-950">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={haberlerUrl(haberlerArticlePath(post.slug))}
              data-gundem-card={i === index ? "hero" : undefined}
              aria-hidden={i !== index}
              tabIndex={i === index ? 0 : -1}
              className={`group block transition-opacity duration-500 ${
                i === index ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
              }`}
            >
              <span className="flex flex-col lg:flex-row">
                <span className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-zinc-100 lg:w-[58%] dark:bg-zinc-900">
                  <GundemCover post={post} priority={i === 0} fill />
                </span>
                <span className="flex flex-1 flex-col justify-center p-5 sm:p-7 lg:py-8">
                  <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
                    <span>{formatGundemCategory(post.category)}</span>
                    {post.trendQuery ? (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                        #{post.trendQuery}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-3 block text-2xl font-semibold leading-snug text-zinc-950 dark:text-zinc-50 sm:text-3xl">
                    {post.title}
                  </span>
                  <span className="mt-3 line-clamp-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                    {post.excerpt}
                  </span>
                  <time className="mt-5 text-xs text-zinc-500" dateTime={post.publishedAt}>
                    {formatGundemDate(post.publishedAt)}
                  </time>
                </span>
              </span>
            </Link>
          ))}
        </div>
        {count > 1 ? (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:bottom-5 sm:right-5">
            <button
              type="button"
              aria-label="Önceki haber"
              onClick={(e) => {
                e.preventDefault();
                go(index - 1);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-zinc-800 shadow-sm ring-1 ring-zinc-200/80 backdrop-blur dark:bg-zinc-950/95 dark:text-zinc-100 dark:ring-zinc-700"
            >
              ‹
            </button>
            <div className="flex gap-1.5" aria-label="Slayt seçimi">
              {posts.map((post, i) => (
                <button
                  key={post.slug}
                  type="button"
                  aria-label={`${post.title} (${i + 1}/${count})`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    go(i);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-zinc-950 dark:bg-zinc-100" : "w-2 bg-zinc-400/80 dark:bg-zinc-500"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Sonraki haber"
              onClick={(e) => {
                e.preventDefault();
                go(index + 1);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-zinc-800 shadow-sm ring-1 ring-zinc-200/80 backdrop-blur dark:bg-zinc-950/95 dark:text-zinc-100 dark:ring-zinc-700"
            >
              ›
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
