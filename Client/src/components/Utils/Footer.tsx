import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { FaYoutube } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

export const Footer = () => {
  const { loading, user } = useSelector((state: RootState) => state.user);

  return (
    <footer className="bg-[#000000] text-white px-6 py-6 md:px-12 w-full border-t border-gray-800 dark:bg-[#151515]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo & Title */}
        <Link to="/home" className="flex items-center gap-3 text-xl font-semibold">
          <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
          <span className="font-semibold font-mono">Alumni Connect</span>
        </Link>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="w-5 h-5 hover:opacity-80 transition" />
          </a>
          <a
            href={!loading && user === null ? "https://github.com" : user?.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="w-5 h-5 hover:opacity-80 transition" />
          </a>
          <a
            href={!loading && user === null ? "https://linkedin.com" : user?.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="w-5 h-5 hover:opacity-80 transition" />
          </a>
          <a
            href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube className="w-5 h-5 hover:opacity-80 transition" />
          </a>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-6 pt-4 text-sm text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Alumni Connect. All rights reserved.</p>
      </div>
    </footer>
  );
};
