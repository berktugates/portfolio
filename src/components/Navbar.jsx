import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import { FaGithubSquare } from "react-icons/fa";
export default function Navbar(){
    return (
        <>
            <div className="flex justify-around items-center border my-4 mx-2 p-2 md:mx-6 rounded-full">
                <h1 className="text-gray-800 font-semibold text-sm md:text-lg">Berktug Berke Ates</h1>
                <ul className="flex gap-2 text-gray-400 md:text-lg">
                    <li className="hover:scale-110 hover:duration-500 hover:ease-in-out"><FaLinkedin size={20}/></li>
                    <li className="hover:scale-110 hover:duration-500 hover:ease-in-out"><IoMail size={20} /></li>
                    <li className="hover:scale-110 hover:duration-500 hover:ease-in-out"><FaGithubSquare size={20} /></li>
                    <li className="hover:scale-110 hover:duration-500 hover:ease-in-out"><FaSquareXTwitter size={20} /></li>
                </ul>
            </div>
        </>
    )
}