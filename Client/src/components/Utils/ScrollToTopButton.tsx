import { useEffect, useState } from "react";
import scrollIcon from "@/assets/up-arrow-icon.svg"

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    setIsVisible(window.scrollY > 100);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scroll({ top: 0, behavior: "smooth" });
  }

  return isVisible && (
    <button onClick={scrollToTop} className="dark:shadow-none shadow-md shadow-black z-50">
      <img src={scrollIcon} className="w-12 h-12 fixed pl-3 pb-1 bottom-12 right-12 cursor-pointer bg-white rounded-full" />
    </button>
  )
}
