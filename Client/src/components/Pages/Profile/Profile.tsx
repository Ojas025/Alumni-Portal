import { useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { clearUser } from "@/store/userSlice";
import { EditProfile } from "./EditProfile";
import { ChangePassword } from "./ChangePassword";
import { ViewProfile } from "./ViewProfile";
import { RootState } from "@/store/Store";
import { Uploads } from "./Uploads";
import { useAuthorize } from "@/hooks/useAuthorize";
import { FaUserCircle } from "react-icons/fa";

type ComponentType = "view" | "edit" | "password" | "uploads";

export const Profile = () => {
  const { userId: profileId } = useParams();
  useAuthorize();

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const isOwnProfile = profileId === user?._id;

  const initialComponent = isOwnProfile ? "edit" : "view";
  const [activeComponent, setActiveComponent] = useState<ComponentType>(initialComponent);
  

  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
      };
      reader.readAsDataURL(file);
    }
  };

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

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-[#f5f3ea] dark:bg-[#000000] transition-colors">
      
      <div className="w-full md:w-1/4 flex flex-col items-center py-10 border-r border-gray-300 dark:border-neutral-800">
        
        {
          user?.profileImageURL ?
          <img
            src={user?.profileImageURL}
            alt="Profile"
            className="rounded-full w-48 h-48 object-cover border-4 border-white"
          />
          : <FaUserCircle className="w-48 h-48"/>
        }
        {
          activeComponent === "edit" && isOwnProfile &&
          <label
            htmlFor="profile-pic-upload"
            className="text-sm text-neutral-700 dark:text-neutral-300 mt-3 cursor-pointer hover:underline"
          >
            Change Profile Picture
          </label>
        }
        <input
          type="file"
          id="profile-pic-upload"
          accept="image/*"
          className="hidden"
          onChange={handleProfilePicChange}
        />

        <div className="mt-8 space-y-3 w-full px-10">
          <button
            className="w-full py-2 text-sm border rounded transition bg-[#000000] dark:bg-[#151515] hover:bg-[#151515] dark:hover:bg-[#222] dark:text-neutral-100 cursor-pointer"
            onClick={() => setActiveComponent("view")}
          >
            View Profile
          </button>

          {isOwnProfile ? (
            <>
              <button
                className="w-full py-2 text-sm border rounded transition bg-[#000000] dark:bg-[#151515] hover:bg-[#151515] dark:hover:bg-[#222] dark:text-neutral-100 cursor-pointer"
                onClick={() => setActiveComponent("edit")}
              >
                Edit Profile
              </button>

              <button
                className="w-full py-2 text-sm border rounded transition bg-[#000000] dark:bg-[#151515] hover:bg-[#151515] dark:hover:bg-[#222] dark:text-neutral-100 cursor-pointer"
                onClick={() => setActiveComponent("password")}
              >
                Change Password
              </button>

              <button
                className="w-full py-2 text-sm border rounded transition bg-[#000000] dark:bg-[#151515] hover:bg-[#151515] dark:hover:bg-[#222] dark:text-neutral-100 cursor-pointer"
                onClick={() => setActiveComponent("uploads")}
              >
                My Uploads
              </button>
            </>
          ) : (
            <>
              <button
                className="w-full py-2 text-sm border rounded transition bg-[#000000] dark:bg-[#151515] hover:bg-[#151515] dark:hover:bg-[#222] dark:text-neutral-100 cursor-pointer"
              >
                Message
              </button>
            </>
          )}

          {isOwnProfile && (
            <button
              className="w-full py-2 text-sm font-semibold border border-red-500 rounded text-red-500 hover:bg-red-500 hover:text-white transition duration-100 bg-white cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="w-full md:w-2/3 p-8 flex flex-col items-center">
        {activeComponent === "view" && (
          <ViewProfile isOwnProfile={isOwnProfile} profileId={profileId ?? ""} />
        )}
        {activeComponent === "edit" && isOwnProfile && <EditProfile />}
        {activeComponent === "password" && isOwnProfile && <ChangePassword />}
        {activeComponent === "uploads" && isOwnProfile && <Uploads />}
      </div>
    </div>
  );
};
