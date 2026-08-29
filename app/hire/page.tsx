import { createHireMetadata, HirePage } from "../components/hire-page";

export async function generateMetadata() {
  return createHireMetadata("en");
}

export default function Hire() {
  return <HirePage locale="en" />;
}
