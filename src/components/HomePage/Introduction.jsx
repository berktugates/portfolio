import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
export default function Introduction() {
  return (
    <>
      <div id="introduction" className="p-6 my-6 md:my-12">
        <motion.h1
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 1,
              delay: 0.6,
            },
          }}
          className="text-4xl font-bold tracking-wide"
        >
          Hi, my name is <span>Berktug</span>
        </motion.h1>
        <motion.p
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 1,
              delay: 1.2,
            },
          }}
          className="text-[10px] md:text-xs mt-2 text-gray-400"
        >
          I enjoy turning complex problems into elegant full-stack applications.
        </motion.p>
        <motion.button
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 1,
              delay: 1.8,
            },
          }}
          whileTap={{ scale: 0.9 }}
          onClick={()=>window.location.href= "mailto:berktugberke@icloud.com"}
          className="flex items-center gap-1 mt-4 text-sm text-start rounded-full text-blue-500"
        >
          Get In Touch <FaArrowRightLong />
        </motion.button>
      </div>
    </>
  );
}
