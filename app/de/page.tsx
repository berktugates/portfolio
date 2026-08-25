import { createHomeMetadata, HomePage } from "../components/home-page";

export async function generateMetadata() {
  return createHomeMetadata("de");
}

export default function GermanHomePage() {
  return <HomePage locale="de" />;
}
