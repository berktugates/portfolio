import EducationListItem from "./EducationListItem";
import { motion } from "framer-motion";

export default function About({ isDark }) {
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
          <h1
            className={
              isDark
                ? "text-2xl text-white font-bold my-1"
                : "text-2xl font-bold my-1"
            }
          >
            About
          </h1>
        </div>
        <p className={isDark ? "text-white" : ""}>
          Hi, I'm Berktug Berke Ates, a passionate software engineer based in
          Marmaris. As a Full Stack Developer, I enjoy building comprehensive
          and dynamic applications from the ground up.
        </p>
        <p className={isDark ? "mt-2 text-white" : "mt-2"}>
          I thrive in team environments and am known for my ambition and
          adaptability. Beyond coding, I have a strong passion for playing the
          guitar, which helps me maintain a balanced and creative lifestyle.
        </p>
        <p className={isDark ? "mt-2 text-white" : "mt-2"}>
          As a dedicated software engineer who is always eager to learn and
          grow, I am open to new opportunities where I can add value to exciting
          projects. If you're looking to add a creative and solution-oriented
          developer to your team or see a potential area for collaboration, feel
          free to get in touch. I look forward to hearing from you and creating
          great projects together.
        </p>
        <h1
          className={
            isDark
              ? "text-lg mt-0.5 text-white font-semibold"
              : "text-lg mt-0.5 font-semibold"
          }
        >
          {" "}
          Education
        </h1>
        <ul className="mb-2">
          <EducationListItem isDark={isDark} />
        </ul>
      </motion.div>
    </>
  );
}
