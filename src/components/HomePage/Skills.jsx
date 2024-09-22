import { ThemeContext, useContext } from "../../../context/ThemeProvider";
import { IoLogoJavascript } from "react-icons/io5";
import { FaHtml5 } from "react-icons/fa";
import { FaCss3 } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import { SiTypescript } from "react-icons/si";
import { FaReact } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { SiExpress } from "react-icons/si";
import { TbFileTypeSql } from "react-icons/tb";
import { motion } from "framer-motion";

export default function Skills() {
  const { isDark } = useContext(ThemeContext);
  return (
    <>
      <motion.div
        id="skills"
        className="p-6"
        initial={{
          opacity: 0,
          x: -50,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className={
            isDark ? "text-2xl text-white font-bold" : "text-2xl font-bold"
          }
        >
          Skills
        </h1>
        <div id="tech-stack">
          <h1
            className={
              isDark
                ? "border-b mt-2 text-lg text-white font-semibold"
                : "border-b mt-2 text-lg font-semibold"
            }
          >
            Tech Stack
          </h1>
          <div id="icons" className="flex flex-wrap justify-center my-2 gap-2">
            <FaHtml5 size={40} color={isDark ? "white" : ""} />
            <FaCss3 size={40} color={isDark ? "white" : ""} />
            <RiTailwindCssFill size={40} color={isDark ? "white" : ""} />
            <IoLogoJavascript size={40} color={isDark ? "white" : ""} />
            <SiTypescript size={40} color={isDark ? "white" : ""} />
            <FaReact size={40} color={isDark ? "white" : ""} />
            <RiNextjsFill size={40} color={isDark ? "white" : ""} />
            <SiExpress size={40} color={isDark ? "white" : ""} />
            <TbFileTypeSql size={40} color={isDark ? "white" : ""} />
          </div>
        </div>
      </motion.div>
    </>
  );
}
