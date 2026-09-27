import Image from "next/image";
import { gundemImageMatchesStory } from "../lib/gundem/cover";
import { formatGundemCategory } from "../lib/gundem/editorial";
import type { GundemBriefing } from "../lib/gundem/types";

export function gundemShowsPhoto(post: GundemBriefing): boolean {
  if (post.cover === "type") return false;
  return gundemImageMatchesStory(post);
}

export function GundemCover({ post, priority = false }: { post: GundemBriefing; priority?: boolean }) {
  const category = formatGundemCategory(post.category);
  if (!gundemShowsPhoto(post)) {
    return (
      <div
        data-gundem-cover="type"
        className="flex aspect-video w-full flex-col justify-end bg-zinc-950 p-4 text-white"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-300">{category}</p>
        <p className="mt-2 line-clamp-3 text-lg font-medium leading-snug">{post.title}</p>
      </div>
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
