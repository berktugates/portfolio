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
    <section aria-labelledby="gundem-hero-heading" data-gundem-carousel className="relative w-full">
      <h2 id="gundem-hero-heading" className="sr-only">
        Öne çıkan haberler
      </h2>
      <div className="overflow-hidden rounded-2xl bg-zinc-300/30 p-px dark:bg-zinc-600/30">
        <div className="overflow-hidden rounded-[15px] bg-white dark:bg-zinc-950">
          <div className="relative w-full overflow-hidden">
            <div
              className="flex w-full transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {posts.map((post, i) => (
                <div key={post.slug} className="w-full shrink-0 grow-0 basis-full">
                  <Link
                    href={haberlerUrl(haberlerArticlePath(post.slug))}
                    data-gundem-card={i === index ? "hero" : undefined}
                    aria-hidden={i !== index}
                    tabIndex={i === index ? 0 : -1}
                    className="group flex w-full flex-col md:flex-row md:items-stretch"
                  >
                    <span className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-zinc-100 md:aspect-auto md:min-h-[12rem] md:w-[44%] md:self-stretch lg:min-h-[14rem] xl:min-h-[16rem] dark:bg-zinc-900">
                      <GundemCover post={post} priority={i === 0} fill />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col justify-center px-4 py-4 md:px-6 md:py-5 lg:py-6">
                      <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
                        <span>{formatGundemCategory(post.category)}</span>
                        {post.trendQuery ? (
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                            #{post.trendQuery}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-2 line-clamp-3 text-xl font-semibold leading-snug text-zinc-950 dark:text-zinc-50 sm:text-2xl lg:line-clamp-2">
                        {post.title}
                      </span>
                      <span className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300 md:text-base lg:line-clamp-4">
                        {post.excerpt}
                      </span>
                      <time className="mt-3 text-xs text-zinc-500" dateTime={post.publishedAt}>
                        {formatGundemDate(post.publishedAt)}
                      </time>
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {count > 1 ? (
            <div
              className="flex items-center justify-center gap-3 border-t border-zinc-100 px-4 py-3 dark:border-zinc-800"
              aria-label="Carousel kontrolleri"
            >
              <button
                type="button"
                aria-label="Önceki haber"
                onClick={() => go(index - 1)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-lg text-zinc-800 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                ‹
              </button>
              <div className="flex flex-wrap justify-center gap-1.5" aria-label="Slayt seçimi">
                {posts.map((post, i) => (
                  <button
                    key={post.slug}
                    type="button"
                    aria-label={`${post.title} (${i + 1}/${count})`}
                    aria-current={i === index ? "true" : undefined}
                    onClick={() => go(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-7 bg-zinc-950 dark:bg-zinc-100" : "w-2 bg-zinc-300 dark:bg-zinc-600"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Sonraki haber"
                onClick={() => go(index + 1)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-lg text-zinc-800 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
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
