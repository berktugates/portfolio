"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ViewTransition, useCallback, useEffect, useRef, useState } from "react";
import { formatMessage } from "../lib/i18n/format";

export type CarouselProject = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  visualClassName: string;
  href: string;
};

export type ProjectsCarouselLabels = {
  ariaLabel: string;
  selectLabel: string;
  showProject: string;
};

type ProjectsCarouselProps = {
  projects: readonly CarouselProject[];
  labels: ProjectsCarouselLabels;
};

export function ProjectsCarousel({ projects, labels }: ProjectsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const centerCard = useCallback((index: number, smooth = true) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;

    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
      behavior:
        smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "smooth"
          : "auto",
    });
    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => centerCard(0, false));
    const handleResize = () => centerCard(activeIndexRef.current, false);
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, [centerCard]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    const closest = Array.from(track.children).reduce(
      (result, child, index) => {
        const card = child as HTMLElement;
        const distance = Math.abs(card.offsetLeft + card.clientWidth / 2 - center);
        return distance < result.distance ? { index, distance } : result;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index;
    activeIndexRef.current = closest;
    setActiveIndex(closest);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.ariaLabel}
    >
      <div ref={trackRef} className="project-track" onScroll={handleScroll}>
        {projects.map((project, index) => (
          <article className="project-card" key={project.slug}>
            <Link
              href={project.href}
              transitionTypes={["project-forward"]}
              className="group block outline-none"
            >
              <ViewTransition name={`project-${project.slug}`} share="project-morph" default="none">
                <span className="relative block aspect-video overflow-hidden rounded-2xl bg-zinc-50/40 p-1.5 ring-1 ring-inset ring-zinc-200/50 transition-all duration-300 group-hover:bg-zinc-100/60 group-hover:ring-zinc-300/60 dark:bg-zinc-950/40 dark:ring-zinc-800/50 dark:group-hover:bg-zinc-900/60 dark:group-hover:ring-zinc-700/60">
                  <span
                    className={`project-visual relative flex h-full items-center justify-center overflow-hidden rounded-[11px] ${project.visualClassName}`}
                  >
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      width={196}
                      height={196}
                      priority={index === 0}
                      className="size-36 rounded-[28px] object-cover shadow-2xl shadow-black/50 sm:size-48 sm:rounded-[38px]"
                    />
                  </span>
                </span>
              </ViewTransition>
              <span className="mt-4 block px-1">
                <span className="flex items-center gap-2">
                  <span className="text-xl font-medium text-zinc-900 dark:text-zinc-50">
                    {project.title}
                  </span>
                  <ArrowUpRight className="size-4 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="mt-1 block text-zinc-500 dark:text-zinc-400">{project.summary}</span>
              </span>
            </Link>
          </article>
        ))}
      </div>
      <div className="mt-4 flex justify-center" aria-label={labels.selectLabel}>
        {projects.map((project, index) => (
          <button
            type="button"
            key={project.slug}
            aria-label={formatMessage(labels.showProject, { title: project.title })}
            aria-current={activeIndex === index ? "true" : undefined}
            className="grid h-6 w-7 place-items-center"
            onClick={() => centerCard(index)}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                activeIndex === index
                  ? "w-7 bg-zinc-900 dark:bg-zinc-100"
                  : "w-1.5 bg-zinc-300 dark:bg-zinc-700"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
