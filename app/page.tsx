import { createHomeMetadata, HomePage } from "./components/home-page";

export const metadata = createHomeMetadata("en");

export default function Home() {
  return <HomePage locale="en" />;
}
