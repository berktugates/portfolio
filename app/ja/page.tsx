import { createHomeMetadata, HomePage } from "../components/home-page";

export const metadata = createHomeMetadata("ja");

export default function JapaneseHomePage() {
  return <HomePage locale="ja" />;
}
