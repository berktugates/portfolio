import { GundemIndexView, createGundemIndexMetadata } from "../components/gundem-index-view";

export const revalidate = 1800;

export async function generateMetadata() {
  return createGundemIndexMetadata();
}

export default function GundemPage() {
  return <GundemIndexView />;
}
