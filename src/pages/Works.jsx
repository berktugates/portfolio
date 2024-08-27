import Navbar from "../components/layouts/Navbar";
import WorksGrid from "../components/WorksPage/WorksGrid"
import Footer from "../components/layouts/Footer";

export default function Works() {
  return (
    <>
      <div className="flex flex-col mx-auto md:max-w-md lg:max-w-lg ">
        <Navbar />
        <WorksGrid />
        <Footer />
      </div>
    </>
  );
}
