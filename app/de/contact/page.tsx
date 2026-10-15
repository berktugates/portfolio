import { ContactPage, createContactMetadata } from "../../components/contact-page";

export async function generateMetadata() {
  return createContactMetadata("de");
}

export default function GermanContactPage() {
  return <ContactPage locale="de" />;
}
