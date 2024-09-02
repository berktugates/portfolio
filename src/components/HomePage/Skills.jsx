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
import { useTranslation } from "react-i18next";

export default function Skills() {
  const{t} = useTranslation();
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
        <h1 className="text-2xl font-bold">{t('skillsTitle')}</h1>
        <div id="tech-stack">
          <h1 className="border-b mt-2 text-lg font-semibold">{t('techStackTitle')}</h1>
          <div id="icons" className="flex flex-wrap justify-center my-2 gap-2">
            <FaHtml5 size={40} />
            <FaCss3 size={40} />
            <RiTailwindCssFill size={40} />
            <IoLogoJavascript size={40} />
            <SiTypescript size={40} />
            <FaReact size={40} />
            <RiNextjsFill size={40} />
            <SiExpress size={40} />
            <TbFileTypeSql size={40} />
          </div>
        </div>
      </motion.div>
    </>
  );
}
