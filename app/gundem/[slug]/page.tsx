import {
  GundemDetailView,
  createGundemDetailMetadata,
  gundemStaticParams,
} from "../../components/gundem-detail-view";

export const dynamicParams = true;
export const revalidate = 1800;

export async function generateStaticParams() {
  return gundemStaticParams();
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: PageProps) {
  return createGundemDetailMetadata(props);
}

export default function GundemDetailPage(props: PageProps) {
  return <GundemDetailView params={props.params} />;
}
