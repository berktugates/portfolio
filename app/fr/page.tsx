import { createHomeMetadata, HomePage } from "../components/home-page";

export async function generateMetadata() {
  return createHomeMetadata("fr");
}

export default function FrenchHomePage() {
  return <HomePage locale="fr" />;
}
