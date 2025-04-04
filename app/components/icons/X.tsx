import { Tcontext } from "@/store/context/ThemeContext";
import React, { useContext } from "react";

interface X {
  href: string;
  isNavbar?: boolean;
}

const X: React.FC<X> = ({ href, isNavbar }) => {
  const context = useContext(Tcontext);
  if (!context) return null;
  const { theme } = context;
  return (
    <>
      <a
        className={`${
          theme == "light" ? "text-black" : "text-white"
        } inline-flex items-center justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-full hover:scale-110 hover:duration-300 hover:transition-all`}
        data-state="closed"
        href={href}
        target="_blank"
      >
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className={isNavbar ? "size-6" : "size-4"}
        >
          <title>X</title>
          <path
            fill="currentColor"
            d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
          ></path>
        </svg>
      </a>
    </>
  );
};
export default X;
