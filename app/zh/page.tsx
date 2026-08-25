import { createHomeMetadata, HomePage } from "../components/home-page";

export async function generateMetadata() {
  return createHomeMetadata("zh");
}

export default function ChineseHomePage() {
  return <HomePage locale="zh" />;
}
