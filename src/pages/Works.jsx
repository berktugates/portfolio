import Navbar from "../components/layouts/Navbar";
import WorksGrid from "../components/WorksPage/WorksGrid"
import Footer from "../components/layouts/Footer";

export default function Works({isDark, setIsDark}) {
  return (
    <>
      <div className={isDark ? "flex flex-col mx-auto md:max-w-md lg:max-w-lg bg-black" :"flex flex-col mx-auto md:max-w-md lg:max-w-lg "}>
        <Navbar isDark={isDark} setIsDark={setIsDark} />
        <WorksGrid isDark={isDark} />
        <Footer isDark={isDark} />
      </div>
    </>
  );
}
