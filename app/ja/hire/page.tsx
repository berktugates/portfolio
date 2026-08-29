import { createHireMetadata, HirePage } from "../../components/hire-page";

export async function generateMetadata() {
  return createHireMetadata("ja");
}

export default function JapaneseHirePage() {
  return <HirePage locale="ja" />;
}
