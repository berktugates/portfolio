import { IoMail } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import { FaGithubSquare } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const {i18n} = useTranslation();
  const handleToggle = async () => {
    window.location.reload();
    if(i18n.language === "en"){
      await i18n.changeLanguage("tr")
    }
    else{
      await i18n.changeLanguage("en")
    }
  };
  return (
    <>
      <div className="flex justify-around items-center border my-4 mx-4 p-4 rounded-2xl">
        <h1 className="text-gray-800 font-semibold text-sm md:text-lg">
          <a href="/">Berktug Berke Ates</a>
        </h1>
        <ul className="flex gap-2 text-gray-400 md:text-lg">
          <li className="hover:scale-110 hover:duration-500 hover:ease-in-out">
            <a href="https://www.linkedin.com/in/berktugates">
              <FaLinkedin size={20} />
            </a>
          </li>
          <li
            onClick={() =>
              (window.location.href = "mailto:berktugberke@icloud.com")
            }
            className="hover:scale-110 hover:duration-500 hover:ease-in-out"
          >
            <IoMail size={20} />
          </li>
          <li className="hover:scale-110 hover:duration-500 hover:ease-in-out">
            <a href="https://github.com/berktugates">
              <FaGithubSquare size={20} />
            </a>
          </li>
        </ul>
        <div id="lang-selection" className="flex gap-2">
          <button onClick={handleToggle}>{i18n.language === "en" ? "🇺🇸" : "🇹🇷"}</button>
        </div>
      </div>
    </>
  );
}
