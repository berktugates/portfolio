import { createHireMetadata, HirePage } from "../../components/hire-page";

export async function generateMetadata() {
  return createHireMetadata("fr");
}

export default function FrenchHirePage() {
  return <HirePage locale="fr" />;
}
