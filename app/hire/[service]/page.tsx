import {
  HireServicePage,
  createHireServiceMetadata,
  hireServiceStaticParams,
} from "../../components/hire-service-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return hireServiceStaticParams();
}

type PageProps = { params: Promise<{ service: string }> };

export async function generateMetadata(props: PageProps) {
  return createHireServiceMetadata("en", props);
}

export default function HireServiceRoute(props: PageProps) {
  return <HireServicePage locale="en" params={props.params} />;
}
