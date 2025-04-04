import React, { useContext } from "react";
import { Tcontext } from "@/store/context/ThemeContext";
import { educations } from "@/constants/Educations";
import EducationCard from "./EducationCard";

const Education: React.FC = () => {
  const context = useContext(Tcontext);
  if (!context) return null;
  const { theme } = context;
  return (
    <>
      <div id="education" className="my-4">
        <h1
          className={`text-lg font-bold mb-1 ${
            theme == "light" ? "text-black" : "text-white"
          }`}
        >
          Education
        </h1>
        {educations.map((education, index) => (
          <div key={index}>
            <EducationCard education={education} />
          </div>
        ))}
      </div>
    </>
  );
};
export default Education;
