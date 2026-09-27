import { notFound } from "next/navigation";
import { GundemIndexView, createGundemIndexMetadata } from "../../../components/gundem-index-view";
import { isGundemCategory } from "../../../lib/gundem/editorial";
import { HABERLER_NAV_CATEGORIES } from "../../../lib/gundem/nav-categories";

export const revalidate = 1800;

export async function generateStaticParams() {
  return HABERLER_NAV_CATEGORIES.map((category) => ({ category }));
}

type PageProps = { params: Promise<{ category: string }> };

export async function generateMetadata(props: PageProps) {
  const { category } = await props.params;
  if (!isGundemCategory(category)) return {};
  return createGundemIndexMetadata(category);
}

export default async function GundemCategoryPage(props: PageProps) {
  const { category } = await props.params;
  if (!isGundemCategory(category)) notFound();
  return <GundemIndexView activeCategory={category} />;
}
