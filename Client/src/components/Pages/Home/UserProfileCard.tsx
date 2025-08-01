import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import githubIcon from "../../../assets/github-logo.png"
import linkedinIcon from "../../../assets/linkedin-logo.png"
import linkIcon from "../../../assets/link-icon.svg"
import linkIconDark from "../../../assets/link-icon-dark.svg"
import settingsIcon from "../../../assets/settings-icon.svg"
import settingsIconDark from "../../../assets/settings-icon-dark.svg"
import { Link } from "react-router";
import { FaUserCircle } from "react-icons/fa";
import { useLogout } from "@/hooks/useLogout";

export const UserProfileCard = () => {

    const isDarkMode = useSelector((state: RootState) => state.config.isDarkMode);
    const user = useSelector((state: RootState) => state.user.user);
    const { logout } = useLogout();

    const socialProfiles = [
        {
            label: "github",
            link: user?.github,
            icon: githubIcon
        },
        {
            label: "linkedin",
            link: user?.linkedin,
            icon: linkedinIcon
        }
    ]

    

    const role = (user?.role[0].toUpperCase() ?? "") + user?.role.substring(1);

  return (
    <div className="dark:bg-[#151515] w-max md:w-4/5 mx-auto md:mx-0 px-8 md:px-4 bg-white rounded-md p-4 text-center dark:shadow-none shadow-xl">
        <div className="flex items-center gap-4 px-2 text-sm">
            {
                user?.profileImageURL ?
                <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={user?.profileImageURL}
                />
                : <FaUserCircle  className="w-6 h-6"/>
            }
            <div>
                <Link to={`/profile/${user?._id}`} className="cursor-pointer font-semibold">{(user?.firstName ?? "") + ' ' + (user?.lastName ?? "")}</Link>
                <p className="text-start text-xs text-gray-400">{role}</p>
            </div>

        </div>

        <hr className="my-4 border-t border-gray-200 dark:border-gray-700 w-[85%] mx-auto"/>

        <div className="text-start text-sm px-2 space-y-2">
            <p className="">🏢 {user?.batch.toString().substring(0, 4)} Batch</p>
            <p className="">📍 {user?.location || "India"}</p>

        </div>

        <hr className="my-4 border-t border-gray-200 dark:border-gray-700 w-[85%] mx-auto"/>

        <div className="px-4 space-y-4">
            <h3 className="font-semibold text-start text-sm">Social Profiles</h3>

            <div>
                {
                    socialProfiles.map((value, index) => (
                        <div key={index} className="flex items-center justify-between px-2 space-y-2">
                            <div className="flex gap-2 items-center text-sm text-start">
                                <img src={value.icon} className="h-4 w-4" />
                                <p>{value.label[0].toUpperCase() + value.label.substring(1)}</p>
                            </div>  
                            <a href={value.link} target="_blank">
                                <img src={isDarkMode ? linkIcon : linkIconDark} className="w-4 h-4" />
                            </a>
                        </div>
                    ))
                }
            </div>
        </div>

        <hr className="my-4 border-t border-gray-200 dark:border-gray-700 w-[85%] mx-auto"/>

        <div className="px-4 flex items-start flex-col gap-3">
            <Link to={`/profile/${user?._id}`} className="flex items-center gap-2 cursor-pointer">
                <img src={isDarkMode ? settingsIcon : settingsIconDark} className="w-4 h-4" />
                <p className="text-sm">Edit Profile</p>
            </Link>

            <button className="text-xs px-4 font-semibold py-0.5 border transition border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-white cursor-pointer" onClick={logout}>Logout</button>
        </div>

    </div>
  );
};

// {}