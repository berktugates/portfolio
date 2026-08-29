import { createHireMetadata, HirePage } from "../../components/hire-page";

export async function generateMetadata() {
  return createHireMetadata("tr");
}

export default function TurkishHirePage() {
  return <HirePage locale="tr" />;
}
