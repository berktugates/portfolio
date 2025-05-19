"use client";
import React, { useContext, useEffect, useState } from "react";
import { Slide, ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Greetings from "./components/Greetings";
import About from "./components/About";
import Education from "./components/Education";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Cursor from "./components/Cursor";
import { Tcontext } from "@/store/context/ThemeContext";
import LoadingScreen from "./Loading";

export const Main: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const context = useContext(Tcontext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 7100);

    return () => clearTimeout(timer);
  }, []);

  if (!context) return null;
  const { theme } = context;

  if (isLoading) {
    return <LoadingScreen />;
  }
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
          <Education />
          <Skills />
          <Contact />
        </div>
      </div>
    </>
  );
};
