import { createHireMetadata, HirePage } from "../../components/hire-page";

export async function generateMetadata() {
  return createHireMetadata("zh");
}

export default function ChineseHirePage() {
  return <HirePage locale="zh" />;
}
