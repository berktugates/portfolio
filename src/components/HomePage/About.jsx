import EducationListItem from "./EducationListItem";
import { motion } from "framer-motion";

export default function About() {
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
          <h1 className="text-2xl font-bold my-1">About</h1>
          <button></button>
        </div>
        <p>
          Hi, I'm <span className="font-semibold">Berktug Berke Ates</span>, a
          passionate software engineer based in Marmaris. As a{" "}
          <span className="font-semibold">Full Stack Developer</span>, I enjoy
          building comprehensive and dynamic applications from the ground up.
        </p>
        <p className="mt-2">
          I thrive in team environments and am known for my ambition and
          adaptability. Beyond coding, I have a strong passion for bodybuilding
          and playing the guitar, which help me maintain a balanced and creative
          lifestyle.
        </p>
        <p className="my-2">
          Feel free to connect with me to discuss technology, projects, or
          anything else that sparks curiosity!
        </p>
        <h1 className="text-lg font-semibold">Education</h1>
        <ul className="mb-2">
          <EducationListItem />
        </ul>
      </motion.div>
    </>
  );
}
