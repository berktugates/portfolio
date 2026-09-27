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

export function GundemHeroCarousel({ posts, intervalMs = 5500 }: GundemHeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = posts.length;

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

  if (count === 0) return null;

  return (
    <section aria-labelledby="gundem-hero-heading" data-gundem-carousel className="relative">
      <h2 id="gundem-hero-heading" className="sr-only">
        Öne çıkan haberler
      </h2>
      <div className="overflow-hidden rounded-2xl bg-zinc-300/30 p-px dark:bg-zinc-600/30">
        <div className="relative overflow-hidden rounded-[15px] bg-white dark:bg-zinc-950">
          <div
            className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                href={haberlerUrl(haberlerArticlePath(post.slug))}
                data-gundem-card={i === index ? "hero" : undefined}
                aria-hidden={i !== index}
                tabIndex={i === index ? 0 : -1}
                className="group flex min-w-full shrink-0 flex-col sm:max-h-[220px] sm:flex-row"
              >
                <span className="relative h-40 w-full shrink-0 overflow-hidden bg-zinc-100 sm:h-auto sm:w-[42%] sm:max-h-[220px] dark:bg-zinc-900">
                  <GundemCover post={post} priority={i === 0} fill className="sm:min-h-[220px]" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3 sm:px-5 sm:py-4">
                  <span className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-zinc-500">
                    <span>{formatGundemCategory(post.category)}</span>
                    {post.trendQuery ? (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                        #{post.trendQuery}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1.5 line-clamp-2 text-lg font-semibold leading-snug text-zinc-950 dark:text-zinc-50 sm:text-xl">
                    {post.title}
                  </span>
                  <span className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-600 dark:text-zinc-300">
                    {post.excerpt}
                  </span>
                  <time className="mt-2 text-[11px] text-zinc-500" dateTime={post.publishedAt}>
                    {formatGundemDate(post.publishedAt)}
                  </time>
                </span>
              </Link>
            ))}
          </div>

          {count > 1 ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-3 pb-2 sm:px-4">
              <button
                type="button"
                aria-label="Önceki haber"
                onClick={() => go(index - 1)}
                className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-lg text-zinc-800 shadow-sm ring-1 ring-zinc-200/80 backdrop-blur dark:bg-zinc-950/95 dark:text-zinc-100 dark:ring-zinc-700"
              >
                ‹
              </button>
              <div className="pointer-events-auto flex gap-1.5" aria-label="Slayt seçimi">
                {posts.map((post, i) => (
                  <button
                    key={post.slug}
                    type="button"
                    aria-label={`${post.title} (${i + 1}/${count})`}
                    aria-current={i === index ? "true" : undefined}
                    onClick={() => go(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-5 bg-zinc-950 dark:bg-zinc-100" : "w-1.5 bg-zinc-400/90 dark:bg-zinc-500"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Sonraki haber"
                onClick={() => go(index + 1)}
                className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-lg text-zinc-800 shadow-sm ring-1 ring-zinc-200/80 backdrop-blur dark:bg-zinc-950/95 dark:text-zinc-100 dark:ring-zinc-700"
              >
                ›
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
