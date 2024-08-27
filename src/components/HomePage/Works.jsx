import info from "../../data/info.json";
import Work from "./Work";
import { motion } from "framer-motion";

export default function Works() {
  const showcase = info.works.slice(0,2);
  console.log(showcase, "showcase")
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
        <h1 className="text-2xl font-bold mb-2">Recent Works</h1>
        {showcase.map((i, key) => (
          <Work i={i} key={key} />
        ))}
        <a href="/works" className="bg-black text-white py-1.5 px-3 md:py-2 md:px-4 lg:py-3 lg:px-6 rounded-lg hover:bg-gray-800">See More Projects</a>
      </motion.div>
    </>
  );
}
