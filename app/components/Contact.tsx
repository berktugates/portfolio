import React, { useContext } from "react";
import { Tcontext } from "@/store/context/ThemeContext";
import X from "./icons/X";

const Contact: React.FC = () => {
  const context = useContext(Tcontext);
  if (!context) return null;
  const { theme } = context;
  return (
    <>
      <div id="contact" className="mt-12 mb-4 flex flex-col items-center">
        <h2
          className={`text-2xl font-bold tracking-tighter sm:text-5xl ${
            theme == "light" ? "text-black" : "text-white"
          }`}
        >
          Get in Touch
        </h2>
        <div id="contact-text" className="mt-4">
          <p
            className={`mx-auto max-w-[600px] ${
              theme == "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Want to chat? Feel free to shoot me a DM on{" "}
            <X href={"https://x.com/karoyildizi"} /> with a clear question, and
            I&apos;ll get back to you whenever I can. You can also reach me via{" "}
            <a
              href="mailto:berktugberke@icloud.com"
              className="underline text-black"
            >
              email
            </a>{" "}
            for anything important. Just a heads-up—I ignore all solicitations.
          </p>
        </div>
      </div>
    </>
  );
};
export default Contact;
