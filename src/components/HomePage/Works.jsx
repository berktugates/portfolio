import info from "../../data/info.json";
import Work from "./Work";
import { motion } from "framer-motion";

export default function Works({ isDark }) {
  const showcase = info.works.slice(0, 2);
  return (
    <>
      <motion.div
        id="works"
        className="p-6 mt-4"
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
            isDark
              ? "text-2xl text-white font-bold mb-2"
              : "text-2xl font-bold mb-2"
          }
        >
          Recent Works
        </h1>
        {showcase.map((i, key) => (
          <Work i={i} key={key} isHomePage={true} isDark={isDark} />
        ))}
        <a
          href="/works"
          className={
            isDark
              ? "bg-gray-100 text-black py-1.5 px-3 md:py-2 md:px-4 lg:py-3 lg:px-6 rounded-lg hover:bg-white"
              : "bg-black text-white py-1.5 px-3 md:py-2 md:px-4 lg:py-3 lg:px-6 rounded-lg hover:bg-gray-800"
          }
        >
          View Detailed Projects
        </a>
      </motion.div>
    </>
  );
}
