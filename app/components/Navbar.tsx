import React, { useContext } from "react";
import { Tcontext } from "@/store/context/ThemeContext";
import GitHub from "./icons/GitHub";
import LinkedIn from "./icons/LinkedIn";
import Light from "./icons/Light";
import X from "./icons/X";

const Navbar: React.FC = () => {
  const context = useContext(Tcontext);
  if (!context) return null;
  const { theme, toggleTheme } = context;

  return (
    <>
      <div
        id="navbar"
        className={`border-b mb-4 flex justify-between items-center ${
          theme == "light" ? "" : "border-white"
        }`}
      >
        <div id="social" className="flex gap-x-4">
          <GitHub />
          <LinkedIn />
          <X href="https://x.com/karoyildizi" isNavbar={true} />
        </div>
        <div id="light-mode" onClick={() => toggleTheme()}>
          <Light />
        </div>
      </div>
    </>
  );
};

export default Navbar;
