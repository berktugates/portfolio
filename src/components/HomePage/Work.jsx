import { useState } from "react";
import { motion } from "framer-motion";

export default function Work({ i, key }) {
  return (
    <>
      <motion.div
        key={key}
        id="work"
        className="border rounded-md shadow-md p-6 my-6 md:p-6 md:mb-6 hover:duration-500 hover:shadow-xl hover:ease-in-out"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <img src={i.img_src} />
        <div className="flex flex-col md:flex-row p-2">
          <div
            id="project-title"
            className="flex flex-col justify-center basis-2/5 mb-2"
          >
            <h1 className="font-semibold text-xl">{i.name}</h1>
            <h3>{i.title}</h3>
            <h5 className="text-xs text-gray-400">
              {i.start_date} - {i.end_date}
            </h5>
          </div>
          <div id="project-introduction" className="basis-3/5">
            {i.desc}
          </div>
        </div>
      </motion.div>
    </>
  );
}
