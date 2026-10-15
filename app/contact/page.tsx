import { ContactPage, createContactMetadata } from "../components/contact-page";

export async function generateMetadata() {
  return createContactMetadata("en");
}

export default function EnglishContactPage() {
  return <ContactPage locale="en" />;
}
