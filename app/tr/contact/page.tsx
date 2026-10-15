import { ContactPage, createContactMetadata } from "../../components/contact-page";

export async function generateMetadata() {
  return createContactMetadata("tr");
}

export default function TurkishContactPage() {
  return <ContactPage locale="tr" />;
}
