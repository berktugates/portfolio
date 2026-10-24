import type { LicensedImage } from "../image-license";
import { validateLicensedImage } from "../image-license";
import type { HaberlerLane } from "./haberler-lanes";
import { categoryToLane } from "./haberler-lanes";
import type { GundemCategory } from "./categories";

type CoverCandidate = Omit<LicensedImage, "alt"> & { altTemplate: string };

/** Pexels — lane başına çeşitli, allowlist host. */
const POOL: Record<HaberlerLane, CoverCandidate[]> = {
  gundem: [
    {
      src: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1200",
      altTemplate: "Türkiye gündemi — şehir ve kamu yaşamı",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "city skyline",
    },
    {
      src: "https://images.pexels.com/photos/1486228/pexels-photo-1486228.jpeg?auto=compress&cs=tinysrgb&w=1200",
      altTemplate: "Meclis ve siyaset gündemi bağlamında kurumsal yapı",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "government building",
    },
    {
      src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200",
      altTemplate: "Toplantı ve kamu gündemi",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "meeting news",
    },
  ],
  ekonomi: [
    {
      src: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1200",
      altTemplate: "Ekonomi ve piyasa gündemi",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "finance charts",
    },
    {
      src: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1200",
      altTemplate: "Türk Lirası ve ekonomi haberleri",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "money economy",
    },
  ],
  spor: [
    {
      src: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1200",
      altTemplate: "Futbol sahası — spor gündemi",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "football stadium",
    },
    {
      src: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1200",
      altTemplate: "Stadyum tribünü — spor haberleri",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "stadium crowd",
    },
  ],
  teknoloji: [
    {
      src: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200",
      altTemplate: "Teknoloji ve dijital altyapı gündemi",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "technology server",
    },
    {
      src: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1200",
      altTemplate: "Mobil teknoloji ve bilişim haberleri",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "smartphone tech",
    },
  ],
  saglik: [
    {
      src: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1200",
      altTemplate: "Sağlık hizmetleri ve kamu sağlığı gündemi",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "healthcare",
    },
    {
      src: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1200",
      altTemplate: "Hastane ve sağlık haberleri",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "hospital",
    },
  ],
  kultur: [
    {
      src: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1200",
      altTemplate: "Konser ve kültür-sanat gündemi",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "concert culture",
    },
    {
      src: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1200",
      altTemplate: "Sinema ve kültür haberleri",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "theater culture",
    },
  ],
};

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function altForTitle(title: string, template: string): string {
  const short = title.replace(/\s+/g, " ").trim().slice(0, 80);
  const alt = `${short} — ${template}`.slice(0, 160);
  return alt.length >= 10 ? alt : template.slice(0, 160);
}

export function pickStoryCoverImage(input: {
  category: GundemCategory;
  title: string;
  excerpt?: string;
  seed?: string;
  usedSrc?: ReadonlySet<string>;
}): LicensedImage {
  const lane = categoryToLane(input.category);
  const pool = POOL[lane];
  const seed = input.seed ?? `${input.title}:${input.category}`;
  const start = hashSeed(seed) % pool.length;
  const used = input.usedSrc ?? new Set<string>();

  for (let i = 0; i < pool.length; i++) {
    const cand = pool[(start + i) % pool.length]!;
    if (used.has(cand.src)) continue;
    const image: LicensedImage = {
      src: cand.src,
      alt: altForTitle(input.title, cand.altTemplate),
      creditName: cand.creditName,
      creditUrl: cand.creditUrl,
      license: cand.license,
      query: cand.query,
    };
    const v = validateLicensedImage(image);
    if (v.ok) return v.image;
  }

  const fallback = pool[0]!;
  return {
    src: fallback.src,
    alt: altForTitle(input.title, fallback.altTemplate),
    creditName: fallback.creditName,
    creditUrl: fallback.creditUrl,
    license: fallback.license,
    query: fallback.query,
  };
}

export function coverModeForStory(): "photo" {
  return "photo";
}
