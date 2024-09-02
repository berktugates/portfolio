import EducationListItem from "./EducationListItem";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  return (
    <>
      <motion.div
        id="about"
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold my-1">{t("aboutTitle")}</h1>
        </div>
        <p>{t("aboutText1")}</p>
        <p className="mt-2">{t("aboutText2")}</p>
        <p className="my-2">{t("aboutText3")}</p>
        <h1 className="text-lg font-semibold"> {t("educationTitle")}</h1>
        <ul className="mb-2">
          <EducationListItem />
        </ul>
      </motion.div>
    </>
  );
}
