import { Dispatch, SetStateAction } from "react";
import { NavItem } from "./Header";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";

interface sidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const Sidebar = (props: sidebarProps) => {

  const { isOpen, setIsOpen } = props;
  const isDarkMode = useSelector((state: RootState) => state.config.isDarkMode);
  
  const listItems = [
    { path: "/admin-dashboard", label: "Admin Dashboard" },
    { path: "/home", label: "Home" },
    { path: "/events", label: "Events" },
    { path: "/jobs", label: "Jobs" },
    { path: "/articles", label: "Articles" },
    { path: "/find-mentor", label: "Find Mentor" },
    { path: "/alumni-directory", label: "Alumni Directory" },
    { path: "/alumni-near-me", label: "Alumni near me" },
    { path: "/gallery", label: "Gallery" },
    { path: "/resources", label: "Resources" },
    { path: "/feedback", label: "Feedback" },
  ]

  if (isOpen){
    return (
      <div className={`w-max h-full lg:hidden block absolute left-0 top-0 z-50`}>
        <ul className={`flex flex-col text-sm justify-between h-[100vh] py-16 px-16 gap-5 ${ !isDarkMode? 'bg-black' : 'bg-white' } `}>
            {
              listItems.map(item => (
                <li>
                  <NavItem url={item.path} label={item.label} />
              </li>
              ))
            }
        </ul>
      </div>
    )
  }

  return null;
}
