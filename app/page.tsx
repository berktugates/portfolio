"use client";
import { useContext } from "react";
import { Tcontext } from "@/store/context/ThemeContext";
import About from "./components/About";
import Contact from "./components/Contact";
import Education from "./components/Education";
import Greetings from "./components/Greetings";
import Skills from "./components/Skills";
import Navbar from "./components/Navbar";
import { Slide, ToastContainer } from "react-toastify";
import Cursor from "./components/Cursor";

export default function Home() {
  const context = useContext(Tcontext);
  if (!context) return null;
  const { theme } = context;
  return (
    <>
      <div
        id="root"
        className={`${theme == "light" ? "bg-white" : "bg-black"} xl:h-screen`}
      >
        <Cursor color={`${theme === "light" ? "#323232a6" : "#f5f5f4a6"}`} />
        <div id="content" className={`flex flex-col max-w-xl mx-auto p-6 `}>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            draggable
            theme="dark"
            transition={Slide}
          />
          <Navbar />
          <Greetings />
          <About />
          {/* <Experience /> */}
          <Education />
          <Skills />
          <Contact />
        </div>
      </div>
    </>
  );
}
