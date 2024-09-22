import { ThemeContext, useContext } from "../../../context/ThemeProvider";
import { motion } from "framer-motion";
import info from "../../data/info.json";
import Work from "../HomePage/Work";

export default function Works() {
  const { isDark } = useContext(ThemeContext);
  return (
    <>
      <motion.div
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
          Works
        </h1>
        <p className="text-[10px] md:text-xs mt-2 text-gray-400">
          Discover some of the projects I made while improving myself.
        </p>
        <div id="works-grid" className="grid grid-cols-1">
          {info.works.map((i, key) => (
            <Work i={i} key={key} isHomePage={false} isDark={isDark} />
          ))}
        </div>
      </motion.div>
    </>
  );
}
