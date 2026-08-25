import { createHomeMetadata, HomePage } from "../components/home-page";

export async function generateMetadata() {
  return createHomeMetadata("ja");
}

export default function JapaneseHomePage() {
  return <HomePage locale="ja" />;
}
