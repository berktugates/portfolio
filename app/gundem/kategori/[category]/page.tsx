import { notFound, redirect } from "next/navigation";
import { GundemIndexView, createGundemIndexMetadata } from "../../../components/gundem-index-view";
import { haberlerUrl } from "../../../lib/gundem/hosts";
import {
  HABERLER_NAV_LANES,
  LEGACY_CATEGORY_TO_LANE,
  isHaberlerLane,
  type HaberlerLane,
} from "../../../lib/gundem/lanes";

export const revalidate = 1800;

export async function generateStaticParams() {
  return HABERLER_NAV_LANES.map((category) => ({ category }));
}

type PageProps = { params: Promise<{ category: string }> };

export async function generateMetadata(props: PageProps) {
  const { category } = await props.params;
  const legacy = LEGACY_CATEGORY_TO_LANE[category];
  const lane = isHaberlerLane(category) ? category : legacy;
  if (!lane) return {};
  return createGundemIndexMetadata(lane);
}

export default async function GundemCategoryPage(props: PageProps) {
  const { category } = await props.params;
  const legacy = LEGACY_CATEGORY_TO_LANE[category];
  if (legacy && category !== legacy) {
    redirect(haberlerUrl(`/kategori/${legacy}`));
  }
  if (!isHaberlerLane(category)) notFound();
  return <GundemIndexView activeLane={category as HaberlerLane} />;
}
