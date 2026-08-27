"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Screenshot = {
  src: string;
  alt: string;
};

export function AppStoreScreenshotGallery({
  screenshots,
  ariaLabel,
  previousLabel,
  nextLabel,
}: {
  screenshots: readonly Screenshot[];
  ariaLabel: string;
  previousLabel: string;
  nextLabel: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const inset = Number.parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    setCanScrollPrevious(track.scrollLeft > inset + 1);
    setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - inset - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateControls();
    const observer = new ResizeObserver(updateControls);
    observer.observe(track);
    return () => observer.disconnect();
  }, [updateControls]);

  const scrollPage = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="app-store-gallery" aria-label={ariaLabel}>
      <button
        type="button"
        className="app-store-gallery-arrow app-store-gallery-arrow-previous"
        aria-label={previousLabel}
        disabled={!canScrollPrevious}
        onClick={() => scrollPage(-1)}
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <ul ref={trackRef} className="app-store-gallery-track" onScroll={updateControls}>
        {screenshots.map((screenshot, index) => (
          <li className="app-store-gallery-item" key={screenshot.src}>
            <div className="app-store-gallery-artwork">
              <Image
                src={screenshot.src}
                alt={screenshot.alt}
                width={444}
                height={960}
                priority={index === 0}
                sizes="(max-width: 480px) 144px, 220px"
                className="app-store-gallery-image"
              />
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="app-store-gallery-arrow app-store-gallery-arrow-next"
        aria-label={nextLabel}
        disabled={!canScrollNext}
        onClick={() => scrollPage(1)}
      >
        <ChevronRight aria-hidden="true" />
      </button>
    </section>
  );
}
