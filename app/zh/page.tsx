import { createHomeMetadata, HomePage } from "../components/home-page";

export const metadata = createHomeMetadata("zh");

export default function ChineseHomePage() {
  return <HomePage locale="zh" />;
}
