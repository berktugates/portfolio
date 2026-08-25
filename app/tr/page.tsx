import { createHomeMetadata, HomePage } from "../components/home-page";

export const metadata = createHomeMetadata("tr");

export default function TurkishHomePage() {
  return <HomePage locale="tr" />;
}
