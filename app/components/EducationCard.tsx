import React, { useContext } from "react";
import Image from "next/image";
import { Tcontext } from "@/store/context/ThemeContext";
import { IEducation } from "@/models/Education";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface IEducationCard {
  education: IEducation;
}

const EducationCard: React.FC<IEducationCard> = ({ education }) => {
  const context = useContext(Tcontext);
  if (!context) return null;
  const { theme } = context;
  const Icon = motion(ChevronRight);
  return (
    <>
      <div id="education-card" className="flex justify-between items-center">
        <div id="education-info" className="flex gap-x-2">
          <Image
            src={education.image}
            width={120}
            height={100}
            className={`rounded-full object-scale-down w-12 h-12 ${
              theme == "light" ? "" : "border border-white"
            }`}
            alt="bbt"
          />
          <div id="education-title">
            <h1
              className={`text-sm font-semibold flex items-center justify-center ${
                theme == "light" ? "text-black" : "text-white"
              }`}
            >
              {education.department}
              <a href="https://yazmf.firat.edu.tr/" target="_blank">
                <Icon
                  size={18}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  whileTap={{scale:1.2}}
                />
              </a>
            </h1>
            <h1
              className={`text-xs ${
                theme == "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {education.school}
            </h1>
          </div>
        </div>
        <div id="education-date">
          <h1
            className={`text-sm ${
              theme == "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {education.startDate} - {education.endDate}
          </h1>
        </div>
      </div>
    </>
  );
};
export default EducationCard;
