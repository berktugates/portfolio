import { createHomeMetadata, HomePage } from "../components/home-page";

export async function generateMetadata() {
  return createHomeMetadata("tr");
}

export default function TurkishHomePage() {
  return <HomePage locale="tr" />;
}
