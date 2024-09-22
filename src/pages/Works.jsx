import { ThemeContext, useContext } from "../../context/ThemeProvider";
import Navbar from "../components/layouts/Navbar";
import WorksGrid from "../components/WorksPage/WorksGrid"
import Footer from "../components/layouts/Footer";

export default function Works() {
  const {isDark} = useContext(ThemeContext) 
  return (
    <>
      <div className={isDark ? "flex flex-col mx-auto md:max-w-md lg:max-w-lg bg-black" :"flex flex-col mx-auto md:max-w-md lg:max-w-lg "}>
        <Navbar/>
        <WorksGrid />
        <Footer/>
      </div>
    </>
  );
}
