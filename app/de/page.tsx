import { createHomeMetadata, HomePage } from "../components/home-page";

export const metadata = createHomeMetadata("de");

export default function GermanHomePage() {
  return <HomePage locale="de" />;
}
