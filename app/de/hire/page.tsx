import { createHireMetadata, HirePage } from "../../components/hire-page";

export async function generateMetadata() {
  return createHireMetadata("de");
}

export default function GermanHirePage() {
  return <HirePage locale="de" />;
}
