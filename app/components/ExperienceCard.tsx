import React, { useContext } from "react";
import Image from "next/image";
import { Tcontext } from "@/store/context/ThemeContext";
import { IExperience } from "@/models/Experience";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface IExperienceCard {
  experience: IExperience;
}

const ExperienceCard: React.FC<IExperienceCard> = ({ experience }) => {
  const context = useContext(Tcontext);
  if (!context) return null;
  const { theme } = context;
  const Icon = motion(ChevronRight);
  return (
    <>
      <div
        id="work-experience-card"
        className="flex justify-between items-center"
      >
        <div id="work-info" className="flex gap-x-2">
          <Image
            src={experience.image}
            width={120}
            height={100}
            className={`rounded-full object-scale-down w-12 h-12 ${
              theme == "light" ? "" : "border border-white"
            }`}
            alt="bbt"
          />
          <div id="work-title">
            <h1
              className={`text-sm font-semibold flex items-center ${
                theme == "light" ? "text-black" : "text-white"
              }`}
            >
              {experience.company}{" "}
              <a href="https://bbtbilisim.com" target="_blank">
                <Icon
                  size={18}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  whileTap={{ scale: 1.2 }}
                />
              </a>
            </h1>
            <h1
              className={`text-xs ${
                theme == "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {experience.title}
            </h1>
          </div>
        </div>
        <div id="work-date">
          <h1
            className={`text-sm ${
              theme == "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {experience.startDate} - {experience.endDate}
          </h1>
        </div>
      </div>
    </>
  );
};
export default ExperienceCard;
