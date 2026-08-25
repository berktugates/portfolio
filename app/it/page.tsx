import { createHomeMetadata, HomePage } from "../components/home-page";

export async function generateMetadata() {
  return createHomeMetadata("it");
}

export default function ItalianHomePage() {
  return <HomePage locale="it" />;
}
