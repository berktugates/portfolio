import { ContactPage, createContactMetadata } from "../../components/contact-page";

export async function generateMetadata() {
  return createContactMetadata("ja");
}

export default function JapaneseContactPage() {
  return <ContactPage locale="ja" />;
}
