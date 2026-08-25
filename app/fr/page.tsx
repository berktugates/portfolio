import { createHomeMetadata, HomePage } from "../components/home-page";

export const metadata = createHomeMetadata("fr");

export default function FrenchHomePage() {
  return <HomePage locale="fr" />;
}
