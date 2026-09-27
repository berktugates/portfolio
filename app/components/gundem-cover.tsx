import Image from "next/image";
import { gundemImageMatchesStory } from "../lib/gundem/cover";
import { formatGundemCategory } from "../lib/gundem/editorial";
import type { GundemBriefing } from "../lib/gundem/types";

export function gundemShowsPhoto(post: GundemBriefing): boolean {
  if (post.cover === "type") return false;
  if (post.cover === "photo") return true;
  return gundemImageMatchesStory(post);
}

export function GundemCover({
  post,
  priority = false,
  fill = false,
  className = "",
}: {
  post: GundemBriefing;
  priority?: boolean;
  /** Parent relative + aspect or fixed height gerekir. */
  fill?: boolean;
  className?: string;
}) {
  const category = formatGundemCategory(post.category);
  const frameClass = fill
    ? `absolute inset-0 h-full w-full ${className}`
    : `aspect-video w-full ${className}`;
  if (!gundemShowsPhoto(post)) {
    return (
      <div
        data-gundem-cover="type"
        className={`flex flex-col justify-end bg-zinc-950 p-4 text-white ${frameClass}`}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-300">{category}</p>
        <p className="mt-2 line-clamp-3 text-lg font-medium leading-snug">{post.title}</p>
      </div>
    );
  }
  if (fill) {
    return (
      <Image
        data-gundem-cover="photo"
        src={post.image.src}
        alt={post.image.alt}
        fill
        sizes="(max-width: 640px) 100vw, 42vw"
        priority={priority}
        unoptimized
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <Image
      data-gundem-cover="photo"
      src={post.image.src}
      alt={post.image.alt}
      width={1200}
      height={675}
      priority={priority}
      unoptimized
      className="aspect-video w-full object-cover"
    />
  );
}
