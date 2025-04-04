import React, { useContext } from "react";
import { Tcontext } from "@/store/context/ThemeContext";

const About: React.FC = () => {
  const context = useContext(Tcontext);
  if (!context) return null;
  const { theme } = context;
  return (
    <>
      <div id="about" className="my-4">
        <h1
          className={`text-lg font-bold ${
            theme == "light" ? "text-black" : "text-white"
          }`}
        >
          About
        </h1>
        <p
          className={`text-sm tracking-wide ${
            theme == "light" ? "text-gray-600" : "text-gray-400"
          }`}
        >
          I graduated with a degree in{" "}
          <span
            className={`font-semibold underline ${
              theme == "light" ? "text-black" : "text-white"
            }`}
          >
            software engineering
          </span>{" "}
          in 2025 and currently work as a{" "}
          <span
            className={`font-semibold underline ${
              theme == "light" ? "text-black" : "text-white"
            }`}
          >
            full-stack software engineer
          </span>
          . I love coding, learning new things, and sharing my knowledge, which
          is why{" "}
          <span
            className={`font-semibold underline ${
              theme == "light" ? "text-black" : "text-white"
            }`}
          >
            I volunteer as an assistant at{" "}
            <a href="https://www.kodluyoruz.org/">Kodluyoruz</a>{" "}
          </span>
          to contribute to the developer community. I also work on projects
          focused on AI and health tech. In my free time, I play the guitar,
          write songs, and explore music. I enjoy combining technology and
          creativity.
        </p>
        <p></p>
      </div>
    </>
  );
};
export default About;
