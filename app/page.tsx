import { Main } from "./Main";

async function getData() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { success: true };
}

export default async function Home() {
  await getData();
  
  return (
   <Main />
  );
}
