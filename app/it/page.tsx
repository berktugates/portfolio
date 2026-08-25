import { createHomeMetadata, HomePage } from "../components/home-page";

export const metadata = createHomeMetadata("it");

export default function ItalianHomePage() {
  return <HomePage locale="it" />;
}
