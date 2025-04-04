import { Tcontext } from "@/store/context/ThemeContext";
import React, { useContext } from "react";

const LinkedIn: React.FC = () => {
  const context = useContext(Tcontext);
  if (!context) return null;
  const { theme } = context;
  return (
    <a
      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-full hover:scale-110 hover:duration-300 hover:transition-all"
      data-state="closed"
      href="https://www.linkedin.com/in/berktugates/"
      target="_blank"
    >
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={`size-6 ${theme == "light" ? "" : "text-white"}`}
      >
        <title>LinkedIn</title>
        <path
          fill="currentColor"
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        ></path>
      </svg>
    </a>
  );
};
export default LinkedIn;
