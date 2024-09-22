import { ThemeContext, useContext } from "../../../context/ThemeProvider";
import { IoMail } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import { FaGithubSquare } from "react-icons/fa";
import { FaMoon } from "react-icons/fa6";
import { MdSunny } from "react-icons/md";

export default function Navbar() {
  const {isDark, setIsDark} = useContext(ThemeContext)
  return (
    <>
      <div
        className={
          isDark
            ? "flex bg-black justify-around items-center border my-4 mx-4 p-4 rounded-2xl"
            : "flex justify-around items-center border my-4 mx-4 p-4 rounded-2xl"
        }
      >
        <h1
          className={
            isDark
              ? "text-white font-semibold text-sm md:text-lg"
              : "text-gray-800 font-semibold text-sm md:text-lg"
          }
        >
          <a href="/">Berktug Berke Ates</a>
        </h1>
        <ul className="flex gap-2 text-gray-400 md:text-lg">
          <li className="hover:scale-110 hover:duration-500 hover:ease-in-out">
            <a href="https://www.linkedin.com/in/berktugates" target="_blank">
              <FaLinkedin size={20} color={isDark ? "white" : ""} />
            </a>
          </li>
          <li
            onClick={() =>
              (window.location.href = "mailto:berktugberke@icloud.com")
            }
            className="hover:scale-110 hover:duration-500 hover:ease-in-out"
          >
            <IoMail size={20} color={isDark ? "white" : ""} />
          </li>
          <li className="hover:scale-110 hover:duration-500 hover:ease-in-out">
            <a href="https://github.com/berktugates" target="_blank">
              <FaGithubSquare size={20} color={isDark ? "white" : ""} />
            </a>
          </li>
        </ul>
        <div id="lang-selection" className="flex gap-2">
          {isDark ? (
            <>
              <MdSunny onClick={() => setIsDark(false)} color="white" />
            </>
          ) : (
            <>
              <FaMoon onClick={() => {setIsDark(true)
                console.log(isDark)
              }} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
