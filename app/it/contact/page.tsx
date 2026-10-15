import { ContactPage, createContactMetadata } from "../../components/contact-page";

export async function generateMetadata() {
  return createContactMetadata("it");
}

export default function ItalianContactPage() {
  return <ContactPage locale="it" />;
}
