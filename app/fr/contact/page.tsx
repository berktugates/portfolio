import { ContactPage, createContactMetadata } from "../../components/contact-page";

export async function generateMetadata() {
  return createContactMetadata("fr");
}

export default function FrenchContactPage() {
  return <ContactPage locale="fr" />;
}
