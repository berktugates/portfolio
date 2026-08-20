"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const items = [
  { title: "AI & Health Tech", description: "Building thoughtful products at the intersection of artificial intelligence and healthcare.", accent: "from-sky-100 via-white to-violet-100 dark:from-sky-950 dark:via-zinc-950 dark:to-violet-950", symbol: "✦" },
  { title: "Full-stack Engineering", description: "Creating reliable, accessible products across web and mobile.", accent: "from-emerald-100 via-white to-cyan-100 dark:from-emerald-950 dark:via-zinc-950 dark:to-cyan-950", symbol: "</>" },
  { title: "Developer Community", description: "Sharing knowledge and contributing to the developer community.", accent: "from-orange-100 via-white to-rose-100 dark:from-orange-950 dark:via-zinc-950 dark:to-rose-950", symbol: "◎" },
];

const AUTO_PLAY_DELAY = 5000;

export function FocusCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(1);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const centerCard = useCallback((index: number, smooth = true) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;

    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
      behavior: smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto",
    });
    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => centerCard(1, false));
    const handleResize = () => centerCard(activeIndexRef.current, false);
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, [centerCard]);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setTimeout(() => {
      centerCard((activeIndexRef.current + 1) % items.length);
    }, AUTO_PLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeIndex, centerCard, isPaused]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    const closestIndex = Array.from(track.children).reduce(
      (closest, child, index) => {
        const card = child as HTMLElement;
        const distance = Math.abs(card.offsetLeft + card.clientWidth / 2 - center);
        return distance < closest.distance ? { index, distance } : closest;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index;
    activeIndexRef.current = closestIndex;
    setActiveIndex(closestIndex);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Areas of focus"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      <div ref={trackRef} className="focus-track" aria-label="Areas of focus" onScroll={handleScroll}>
        {items.map((item, index) => (
          <article
            className="focus-card"
            key={item.title}
            role="button"
            tabIndex={0}
            aria-label={`Show ${item.title}`}
            onClick={() => centerCard(index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                centerCard(index);
              }
            }}
          >
            <div className={`relative flex aspect-video overflow-hidden rounded-xl border border-zinc-200/70 bg-gradient-to-br ${item.accent} dark:border-zinc-800`}>
              <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_center,rgba(113,113,122,.25)_1px,transparent_1px)] [background-size:18px_18px]" />
              <div className="relative m-auto flex size-24 items-center justify-center rounded-3xl border border-white/80 bg-white/70 text-3xl shadow-xl shadow-zinc-900/5 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/70">{item.symbol}</div>
            </div>
            <h3 className="mt-4 text-xl font-medium text-zinc-900 dark:text-zinc-50">{item.title}</h3>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">{item.description}</p>
          </article>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2" aria-label="Select focus card">
        {items.map((item, index) => (
          <button
            type="button"
            key={item.title}
            aria-label={`Show ${item.title}`}
            aria-current={activeIndex === index ? "true" : undefined}
            className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${activeIndex === index ? "w-7 bg-zinc-900 dark:bg-zinc-100" : "w-1.5 bg-zinc-300 dark:bg-zinc-700"}`}
            onClick={() => centerCard(index)}
          />
        ))}
      </div>
    </div>
  );
}
