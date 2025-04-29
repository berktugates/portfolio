import React, { useContext } from "react";
import { Tcontext } from "@/store/context/ThemeContext";
import Image from "next/image";
import img from "../../public/me.png";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ArrowDownToLine } from "lucide-react";
import {saveAs} from "file-saver";

const Greetings: React.FC = () => {
  const context = useContext(Tcontext);
  if (!context) return null;
  const { theme } = context;
  const MotionImage = motion(Image);

  const handleDownload = () => {
    const fileUrl = "/BerktugBerkeAtes.pdf";
    const fileName = "BerktugBerkeAtes.pdf"; 
    
    fetch(fileUrl)
      .then((res) => res.blob())
      .then((blob) => saveAs(blob, fileName));
  };

  return (
    <>
      <div id="greetings" className="flex flex-row items-center my-4">
        <div id="text">
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
            className={`text-3xl md:text-5xl font-bold mb-2 ${
              theme == "light" ? "" : "text-white"
            }`}
          >
            Hi, I&apos;m Berktug 👋
          </motion.h1>
          <p className={`text-lg ${theme == "light" ? "" : "text-white"}`}>
            A software engineer, guitarist and songwriter who loves developing
            and enjoys creating.
          </p>
          <a
            onClick={()=> handleDownload()}
            className={`mt-2 flex items-center gap-x-2 text-2xl font-bold ${
              theme === "light" ? "" : "text-white"
            } hover:text-blue-500 hover:transition-all hover:duration-300`}
          >
            Download Résumé <ArrowDownToLine />
          </a>
        </div>
        <MotionImage
          onClick={() =>
            toast("If you clicked, you found real talent, not just 'clickbait'")
          }
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          src={img}
          width={100}
          className={`rounded-2xl aspect ${theme == "light" ? "" : ""}`}
          alt="berktug's photo"
        />
      </div>
    </>
  );
};

export default Greetings;
