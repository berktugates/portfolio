import { ContactPage, createContactMetadata } from "../../components/contact-page";

export async function generateMetadata() {
  return createContactMetadata("zh");
}

export default function ChineseContactPage() {
  return <ContactPage locale="zh" />;
}
