import { createHireMetadata, HirePage } from "../../components/hire-page";

export async function generateMetadata() {
  return createHireMetadata("it");
}

export default function ItalianHirePage() {
  return <HirePage locale="it" />;
}
