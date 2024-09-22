import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeProvider";

export default function EducationListItem() {
  const { isDark } = useContext(ThemeContext);
  return (
    <>
      <div
        id="list-item"
        className="flex justify-between items-center border p-1.5 mt-1 rounded-xl"
      >
        <div id="logo-name" className="flex items-center gap-1">
          <img
            src="../../public/firatuniversity.png"
            alt="university-logo"
            className="h-8"
          />
          <div id="name-departman">
            <h1
              className={
                isDark
                  ? "font-semibold text-white text-sm"
                  : "font-semibold text-sm"
              }
            >
              {" "}
              Firat University
            </h1>
            <h3 className="text-xs text-gray-400">Software Engineering</h3>
          </div>
        </div>
        <h1 className={isDark ? "text-xs text-white" : "text-xs"}>2020-2025</h1>
      </div>
    </>
  );
}
