import logo from "../../assets/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearUser } from "@/store/userSlice";
import { RootState } from "@/store/Store";
import { useEffect, useState } from "react";
import { toggleMode } from "@/store/configSlice";
import { FaUserCircle } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { BsSunFill, BsMoon } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { FaSortDown } from "react-icons/fa";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkMode = useSelector((state: RootState) => state.config.isDarkMode);
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const [navDropdown, setNavDropdown] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const unseenNotifications = 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`#header-more`)) {
        setDropdownVisibility(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const navItems = [
    { path: "/home", label: "Home" },
    { path: "/events", label: "Events" },
    { path: "/jobs", label: "Jobs" },
    { path: "/articles", label: "Articles" },
    { path: "/find-mentor", label: "Find Mentor" },
    { path: "/alumni-directory", label: "Alumni Directory" },
  ];

  const moreNavItems = [
    { path: "/alumni-near-me", label: "Alumni near me" },
    { path: "/gallery", label: "Gallery" },
    { path: "/resources", label: "Resources" },
    { path: "/feedback", label: "Feedback" },
  ];

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        "http://localhost:3000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        dispatch(clearUser());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");
      } else {
        console.log("Failed to log out");
      }
    } catch (error) {
      console.error("Error while logging out", error);
    }
  };

  const handleModeToggle = () => {
    dispatch(toggleMode());
  };

  const toggleDropdown = () => setDropdownVisibility((prev) => !prev);

  return (
    <nav className="sticky flex flex-wrap items-center justify-between w-full px-6 py-4 dark:bg-black/70 bg-white/40 text-black backdrop-blur-md shadow-md top-0 z-50">
      <Link to={"/"} className="flex gap-3 items-center">
        <img src={logo} className="w-12 h-12" />
        <h1 className="text-2xl font-bold text-black dark:text-white font-mono">
          Alumni Connect
        </h1>
      </Link>

      

      <ul className="lg:flex gap-6 text-sm hidden">
      {
        user?.role === 'admin' &&
        <NavLink
        to={'/admin-dashboard'}
        className={({ isActive }) =>
          `${
            isActive
              ? "dark:text-white text-black font-semibold"
              : "dark:text-gray-400 text-gray-600"
          } cursor-pointer dark:hover:text-white hover:text-black transition`
        }
      >
        Admin Dashboard
      </NavLink>
      }

        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "dark:text-white text-black font-semibold"
                    : "dark:text-gray-400 text-gray-600"
                } cursor-pointer dark:hover:text-white hover:text-black transition`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}

        <li className="relative">
          <div
            className="cursor-pointer flex gap-1 dark:hover:text-white hover:text-black transition dark:text-gray-400 text-gray-600"
            onClick={() => {
              setNavDropdown((prev) => !prev);
            }}
          >
            <FaSortDown className="w-4 h-4" />
            More
          </div>

          {navDropdown && (
            <ul className="absolute -bottom-[100] right-0 left-0 z-10 flex flex-col gap-2 dark:bg-black bg-white/90 rounded-sm py-2 px-2 w-max  text-center">
              {moreNavItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    id="header-more"
                    onClick={() => setNavDropdown(false)}
                    to={item.path}
                    className={({ isActive }) =>
                      `${
                        isActive
                          ? "dark:text-white text-black font-semibold"
                          : "dark:text-gray-400 text-gray-600"
                      } cursor-pointer dark:hover:text-white hover:text-black w-full transition px-4 py-2`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>

      <div className="flex gap-6 text-2xl items-center relative">
        <button className="cursor-pointer relative">
          <IoNotifications className="w-5 h-5  dark:text-white text-black" />
          <span className="dark:bg-gray-500 bg-gray-700 w-5 flex items-center justify-center h-5  rounded-full font-semibold text-lime-400 text-sm absolute -top-3 -right-2.5">
            {unseenNotifications}
          </span>
        </button>

        <button className="cursor-pointer" onClick={handleModeToggle}>
          {isDarkMode ? (
            <BsSunFill className="w-5 h-5  dark:text-white text-black" />
          ) : (
            <BsMoon className="w-5 h-5 text-black dark:text-white" />
          )}
        </button>

        <Link to={"/chat"} className="cursor-pointer">
          <IoChatbubbleEllipsesOutline className="w-6 h-6 dark:text-white text-black" />
        </Link>

        <button onClick={toggleDropdown} className="cursor-pointer">
          {user?.profileImageURL ? (
            <img
              src={user.profileImageURL}
              alt="user"
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <FaUserCircle className="w-8 h-8 dark:text-white text-black" />
          )}
        </button>

        {dropdownVisibility && (
          <div className="absolute top-12 right-0 z-20 w-36 rounded-md border border-black bg-white text-black text-sm shadow-lg dark:bg-black dark:border-white dark:text-white">
            <Link
              onClick={toggleDropdown}
              to={`/profile/${user?._id}`}
              className="block px-4 py-2 dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white rounded-t-md"
            >
              Edit Profile
            </Link>
            <div
              onClick={handleLogout}
              className="px-4 py-2 cursor-pointer dark:hover:bg-white hover:bg-black hover:text-white dark:hover:text-black rounded-b-md"
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// {}
