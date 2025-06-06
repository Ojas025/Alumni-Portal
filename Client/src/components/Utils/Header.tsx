import logo from "../../assets/logo.png";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateUser } from "@/store/userSlice";
import { RootState } from "@/store/Store";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { FaSortDown } from "react-icons/fa";
import { Request } from "./Request";
import { useNotification } from "@/hooks/useNotification";
import { useLogout } from "@/hooks/useLogout";
import { MenuIcon } from "lucide-react";
import { Sidebar } from "./Sidebar";

export interface Notification {
  sender: {
    firstName: string;
    lastName: string;
    _id: string;
    profileImageURL: string;
  };
  _id: string;
  type: string;
  status: 'pending' | 'accepted' | 'rejected'

}  

export const Header = () => {
  
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.config.isDarkMode);
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const [navDropdown, setNavDropdown] = useState(false);
  const [notificationPanel, setNotificationPanel] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sidebar, setSidebar] = useState(false);
  
  const { user } = useSelector((state: RootState) => state.user);
  const { notify } = useNotification();
  const { logout } = useLogout();
 
  const fetchPendingNotifications = async () => {
    try {
      const result = await axios.get(
        'http://localhost:3000/api/invitation/pending',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      )

      if (result.status !== 200) {
        notify({ id: 'notification-toast', type: 'error', content: 'Error fetching notifications' })
        return;
      }
      
      setNotifications(result.data.data);

    } catch (error) {
      console.error("Error fetching notifications", error);
      notify({ id: 'notification-toast', type: 'error', content: 'Error fetching notifications' })
    }
  };

  useEffect(() => {    

    if (user) fetchPendingNotifications();

  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`#profile-dropdown`) && !target.closest(`#profile-btn`)) {
        setDropdownVisibility(false);
      }
      if (!target.closest(`#header-more`)) {
        setNavDropdown(false);
      }
      if (!target.closest(`#notification-panel`)) {
        setNotificationPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isDarkMode) {
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
    { path: "/admin-dashboard", label: "Admin Dashboard" },
    { path: "/alumni-near-me", label: "Alumni near me" },
    { path: "/gallery", label: "Gallery" },
    { path: "/resources", label: "Resources" },
    { path: "/feedback", label: "Feedback" },
  ];

  const handleAcceptRequest = async (invitationId: string) => {
    try {
      const result = await axios.put(`http://localhost:3000/api/invitation/accept/${invitationId}`, {}, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (result.status !== 200){
        notify({ id: 'notification-toast', type: 'error', content: 'Error accepting notification' })
        return;
      }

      dispatch(updateUser(result.data.data.user));
      fetchPendingNotifications();

    } catch (error) {
      console.error('Error accepting notification', error)
      notify({ id: 'notification-toast', type: 'error', content: 'Error accepting notification' })
    }
  }

  const handleRejectRequest = async (invitationId: string) => {
    try {
      const result = await axios.put(`http://localhost:3000/api/invitation/reject/${invitationId}`, {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );  

      if (result.status !== 200){
        notify({ id: 'notification-toast', type: 'error', content: 'Error accepting notification' })
        return;
      }

      dispatch(updateUser(result.data.data.user));
      fetchPendingNotifications();

    } catch (error) {
      console.error('Error accepting notification', error)
      notify({ id: 'notification-toast', type: 'error', content: 'Error accepting notification' })
    }
  }

  const toggleDropdown = () => setDropdownVisibility((prev) => !prev);

  return (
    <nav className="sticky flex flex-wrap items-center justify-between w-full px-6 py-4 dark:bg-black/70 bg-white/40 text-black backdrop-blur-md shadow-md top-0 z-50">

      {/* Logo */}
      <Link to={"/"} className="flex gap-3 items-center">
        <img src={logo} className="w-12 h-12" />
        <h1 className="text-2xl font-bold text-black dark:text-white font-mono">
          Alumni Connect
        </h1>
      </Link>

      {/* Navbar Items */}
      <ul className="hidden lg:flex gap-6 text-sm">
        {/* {
          user?.role === 'admin' &&
          <NavItem url="/admin-dashboard" label="Admin Dashboard" />
        } */}

        {navItems.map((item) => (
          <li key={item.path}>
            <NavItem url={item.path} label={item.label} />
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
            <ul className="absolute z-10 right-0 flex flex-col gap-2 dark:bg-black bg-white/90 rounded-lg py-2 shadow-lg transition-all ease-in-out duration-300 w-48 px-4 text-center" id="header-more">
              {moreNavItems.map((item) => {

                if (item.label == "Admin Dashboard"){
                  if (user?.role === "admin") return (
                    <NavItem url={item.path} label={item.label} />
                  )
                  else return;
                }
                
                return (
                  <li key={item.path} className="px-3">
                    <NavItem url={item.path} label={item.label} />
                  </li>
                )
            })}
            </ul>
          )}
        </li>
      </ul>

      {/* Sidebar */}
      { sidebar && <Sidebar isOpen={sidebar} setIsOpen={setSidebar} />}


      {/* Utility Icons */}
      <div className="flex gap-6 text-2xl items-center relative">

          <MenuIcon className={`w-4 h-4 block lg:hidden cursor-pointer ${isDarkMode ? 'text-black' : 'text-white'} `} onClick={() => setSidebar(prev => !prev)} />

        <button className="cursor-pointer relative">
          <IoNotifications onClick={() => setNotificationPanel(prev => !prev)} className="w-5 h-5 dark:text-white text-black" />
          <span className="dark:bg-gray-500 bg-gray-700 w-5 flex items-center justify-center h-5 rounded-full font-semibold text-lime-400 text-sm absolute -top-3 -right-2.5">
            {notifications.length ?? 0}
          </span>
        </button>

        {/* Notification Panel */}
        {notificationPanel && (
            <ul className="absolute z-10 right-16 top-14 dark:bg-gray-800 bg-white rounded-sm py-2 shadow-lg transition-all ease-in-out duration-300 w-max" id="notification-panel">
              {notifications.map((notification) => (
                <li key={notification._id}>
                  <Request senderName={notification.sender.firstName + ' ' + notification.sender.lastName} type={notification.type} key={notification._id} _id={notification._id} onAccept={handleAcceptRequest} onReject={handleRejectRequest}  />
                </li>
              ))}
            </ul>
          )}
{/* 
        <button className="cursor-pointer" onClick={handleModeToggle}>
          {isDarkMode ? (
            <BsSunFill className="w-5 h-5 dark:text-white text-black" />
          ) : (
            <BsMoon className="w-5 h-5 text-black dark:text-white" />
          )}
        </button> */}

        <Link to={"/chat"} className="cursor-pointer">
          <IoChatbubbleEllipsesOutline className="w-6 h-6 dark:text-white text-black" />
        </Link>

        {/* Profile Dropdown */}
        <button
          id="profile-btn"
          onClick={toggleDropdown}
          className="cursor-pointer"
        >
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
          <div className="absolute top-10 py-2 px-4 right-0 z-20 w-max rounded-md border border-transparent bg-white text-black text-sm shadow-lg dark:bg-black dark:text-white" id="profile-dropdown">
            <Link
              onClick={toggleDropdown}
              to={`/profile/${user?._id}`}
              className="dark:text-gray-400 text-gray-600 cursor-pointer dark:hover:text-white hover:text-black w-full transition rounded-md py-2"
            >
              Edit Profile
            </Link>
            <div
              onClick={logout}
              className="dark:text-gray-400 text-gray-600 cursor-pointer dark:hover:text-white hover:text-black w-full transition rounded-md py-2"
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

interface NavItemProps {
  url: string;
  label: string;
}

export const NavItem = (props: NavItemProps) => {
  const { url, label } = props;

  return (
    <NavLink
      to={url}
      className={({ isActive }) =>
        `${
          isActive
            ? "dark:text-white text-black font-semibold"
            : "dark:text-gray-400 text-gray-600"
        } cursor-pointer dark:hover:text-white hover:text-black transition`
      }
    >
      {label}
    </NavLink>
  )
}

// {}