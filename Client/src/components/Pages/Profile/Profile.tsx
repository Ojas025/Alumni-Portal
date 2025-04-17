import { useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { clearUser, uploadProfileImage } from "@/store/userSlice";
import { EditProfile } from "./EditProfile";
import { ChangePassword } from "./ChangePassword";
import { ViewProfile } from "./ViewProfile";
import { RootState } from "@/store/Store";
import { Uploads } from "./Uploads";
import { useAuthorize } from "@/hooks/useAuthorize";
import { FaUserCircle } from "react-icons/fa";
import { PencilIcon } from "lucide-react";
import { UploadModal } from "./UploadModal";

type ComponentType = "view" | "edit" | "password" | "uploads";

export const Profile = () => {
  const { userId: profileId } = useParams();
  const [modalVisibility, setModalVisibility] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageSrc, setImageSrc] = useState("");
    const [error, setError] = useState("");
  useAuthorize();

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const isOwnProfile = profileId === user?._id;

  const initialComponent = isOwnProfile ? "edit" : "view";
  const [activeComponent, setActiveComponent] = useState<ComponentType>(initialComponent);
  
  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
  
      if (!file) return;
      setSelectedFile(file);
  
      const reader = new FileReader();
  
      reader.addEventListener("load", () => {
        const imageElement = new Image();
        const imageURL = reader.result?.toString() || "";
        imageElement.src = imageURL;
  
        imageElement.addEventListener("load", (e) => {
          if (error) setError("");
          const { naturalHeight, naturalWidth } = e.currentTarget;
  
          if (naturalHeight < 152 || naturalWidth < 152) {
            setError("Image must be atleast 150x150 pixels");
            setImageSrc("");
            return;
          }
        });
  
        setImageSrc(imageURL);
      });
  
      reader.readAsDataURL(file);
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

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData()
    formData.append('profileImage', selectedFile);

    try {
      const result = await axios.post(
        `http://localhost:3000/api/user/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      
      if (result.status === 200){
        const profileImageURL = result.data.data.profileImageURL;
        dispatch(uploadProfileImage(profileImageURL));
        // console.log(user?.profileImageURL);
        
        console.log('upload successfull')
      }
      else{
        console.log('Upload failed')
      }


    } catch (error) {
      console.error('Error uploading image', error);
    }
    finally {
      setModalVisibility(false);
      setSelectedFile(null);
    }
    
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen relative bg-[#e6e9da] dark:bg-[#000000] transition-colors">

      {
        modalVisibility &&  
        <UploadModal handleImageUpload={handleImageUpload} setModalVisibility={setModalVisibility} handleSelectFile={handleSelectFile} imageSrc={imageSrc} error={error} />
      }
      
      <div className="w-full md:w-1/4 flex flex-col items-center py-10 border-r border-gray-300 dark:border-neutral-800">
        
        <div className="relative mb-8 border border-white rounded-full">
         {
          user?.profileImageURL ?
          <img
            src={user?.profileImageURL}
            alt="Profile"
            className="rounded-full w-48 h-48 object-cover border-4 border-white"
          />
          : <FaUserCircle className="w-38 h-38"/>
        }
        {
          activeComponent === "edit" && isOwnProfile &&
          <div className="h-fit p-[.35rem] rounded-full absolute bottom-[-1rem] left-0 right-0 border border-white text-white bg-gray-800 cursor-pointer m-auto w-fit" onClick={() => setModalVisibility(prev => !prev)}>
            <PencilIcon />
          </div>
        }
        </div>

        <input
          type="file"
          id="profile-pic-upload"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <div className="mt-8 space-y-3 w-full px-10">
          <button
            className="w-full py-2 text-sm border rounded-lg transition bg-[#000000] dark:bg-[#151515] hover:bg-[#151515] dark:hover:bg-[#222] dark:text-neutral-100 cursor-pointer"
            onClick={() => setActiveComponent("view")}
          >
            View Profile
          </button>

          {isOwnProfile ? (
            <>
              <button
                className="w-full py-2 text-sm border rounded-lg transition bg-[#000000] dark:bg-[#151515] hover:bg-[#151515] dark:hover:bg-[#222] dark:text-neutral-100 cursor-pointer"
                onClick={() => setActiveComponent("edit")}
              >
                Edit Profile
              </button>

              <button
                className="w-full py-2 text-sm border rounded-lg transition bg-[#000000] dark:bg-[#151515] hover:bg-[#151515] dark:hover:bg-[#222] dark:text-neutral-100 cursor-pointer"
                onClick={() => setActiveComponent("password")}
              >
                Change Password
              </button>

              <button
                className="w-full py-2 text-sm border rounded-lg transition bg-[#000000] dark:bg-[#151515] hover:bg-[#151515] dark:hover:bg-[#222] dark:text-neutral-100 cursor-pointer"
                onClick={() => setActiveComponent("uploads")}
              >
                My Uploads
              </button>
            </>
          ) : (
            <>
              <button
                className="w-full py-2 text-sm border rounded-lg transition bg-[#000000] dark:bg-[#151515] hover:bg-[#151515] dark:hover:bg-[#222] dark:text-neutral-100 cursor-pointer"
              >
                Message
              </button>
            </>
          )}

          {isOwnProfile && (
            <button
              className="w-full py-2 text-sm font-semibold border-lg border-red-500 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition duration-100 bg-white cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="w-full md:w-3/4 px-24 py-8 flex flex-col items-center">
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
