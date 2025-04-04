import React, { useContext } from "react";
import { Tcontext } from "@/store/context/ThemeContext";
import { skills } from "@/constants/Skills";

const Skills: React.FC = () => {
  const context = useContext(Tcontext);
  if (!context) return null;
  const { theme } = context;
  return (
    <>
      <div id="skills" className="my-4">
        <h1
          className={`text-lg font-bold mb-2 ${
            theme == "light" ? "text-black" : "text-white"
          }`}
        >
          Skills
        </h1>
        <div id="skills-list" className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className={`px-2.5 py-1 text-xs text-center font-semibold rounded-md ${
                theme == "light"
                  ? "text-white bg-black"
                  : "text-black bg-white"
              } hover:scale-110 hover:duration-300`}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};
export default Skills;
