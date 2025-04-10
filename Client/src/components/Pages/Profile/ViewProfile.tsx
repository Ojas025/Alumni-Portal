import { useEffect, useState } from "react";
import {
  FaBirthdayCake, FaLinkedin, FaGithub, FaUserCheck, FaUserPlus,
  FaGraduationCap, FaUserCircle
} from "react-icons/fa";
import { IoMailOpenOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { MdWork } from "react-icons/md";
import { GiSkills } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { updateUser, User } from "@/store/userSlice";
import axios from "axios";
import { useNotification } from "@/hooks/useNotification";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/Utils/Badge";

type ViewProfileProps = {
  profileId: string;
  isOwnProfile: boolean;
};

export const ViewProfile = ({ profileId, isOwnProfile }: ViewProfileProps) => {
  const [profileData, setProfileData] = useState<User | null>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionCount, setConnectionCount] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          `http://localhost:3000/api/user/profile/${profileId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const profile = result.data?.data;

        if (profile) {
          setProfileData(profile);
        }
      } catch (error) {
        console.error("Error fetching profile", error);
        notify({ id: "profile-toast", type: "error", content: "Error fetching profile" });
      } finally {
        setLoading(false);
      }
    };

    if (isOwnProfile) {
      setProfileData(user);
    } else {
      fetchProfile();
    }
  }, [isOwnProfile, profileId, user, notify]);

  useEffect(() => {
    if (profileData && user?._id) {
      setIsConnected(profileData.connections.some(connection => connection._id === user?._id) ?? false);
      setConnectionCount(profileData.connections.length ?? 0);
    }
  }, [isOwnProfile, user, profileData]);

  const handleAddConnection = async (connecteeId: string) => {
    try {
      setLoading(true);
      const result = await axios.put(
        `http://localhost:3000/api/user/connect/${connecteeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const updatedUser = result.data?.data;

      if (updatedUser) {
        dispatch(updateUser(updatedUser));
        notify({ id: "connection-toast", type: "success", content: "Connection added successfully" });
      }
    } catch (error) {
      console.error("Error adding connection", error);
      notify({ id: "connection-toast", type: "error", content: "Could not add connection" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveConnection = async (connecteeId: string) => {
    try {
      setLoading(true);
      const result = await axios.delete(
        `http://localhost:3000/api/user/disconnect/${connecteeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const updatedUser = result.data?.data;

      if (updatedUser) {
        dispatch(updateUser(updatedUser));
        notify({ id: "connection-toast", type: "success", content: "Connection removed successfully" });
      }
    } catch (error) {
      console.error("Error disconnecting profile", error);
      notify({ id: "connection-toast", type: "error", content: "Could not remove connection" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-md dark:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-neutral-700 pb-4 mb-6">
        <div className="flex gap-4 items-center">
          {profileData?.profileImageURL ? (
            <img
              src={profileData.profileImageURL}
              className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-neutral-700"
            />
          ) : (
            <FaUserCircle className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          )}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {profileData?.firstName} {profileData?.lastName}
            </h2>
            <span className="text-sm dark:text-gray-300 text-gray-500 ml-2">
              {connectionCount} connections
            </span>
          </div>
        </div>

        {/* Only show Connect button if not own profile */}
        {!isOwnProfile && (
          <button
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium border transition disabled:opacity-60 disabled:cursor-not-allowed
              ${isConnected
                ? "bg-gray-900 text-white dark:bg-white dark:text-black border-black dark:border-white"
                : "bg-white text-black dark:bg-black dark:text-white border-black dark:border-white"
              }`}
            onClick={() => {
              if (isConnected) {
                handleRemoveConnection(profileId);
              } else {
                handleAddConnection(profileId);
              }
            }}
          >
            {loading ? (
              <>
                <Spinner />
                <span>Loading...</span>
              </>
            ) : (
              <>
                {isConnected ? <FaUserCheck /> : <FaUserPlus />}
                {isConnected ? "Connected" : "Connect"}
              </>
            )}
          </button>
        )}
      </div>

      {/* Bio */}
      <div className="mb-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        {profileData?.bio}
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-700 dark:text-gray-300 mb-6">
        <ProfileDetail icon={<IoMailOpenOutline />} label="Email" value={profileData?.email || '-'} />
        <ProfileDetail icon={<FaBirthdayCake />} label="DOB" value={profileData?.dob || '-'} />
        <ProfileDetail icon={<FaLocationDot />} label="Location" value={profileData?.location || '-'} />
        <ProfileDetail icon={<FaGraduationCap />} label="Batch" value={profileData?.batch || '-'} />
        <ProfileDetail icon={<MdWork />} label="Role" value={profileData?.role || '-'} />
        <ProfileDetail
          icon={<FaLinkedin />}
          label="LinkedIn"
          value={
            <a
              href={profileData?.linkedin}
              target="_blank"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              View Profile
            </a>
          }
        />
        <ProfileDetail
          icon={<FaGithub />}
          label="GitHub"
          value={
            <a
              href={profileData?.github}
              target="_blank"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              View Profile
            </a>
          }
        />
      </div>

      {/* Skill Badges */}
      <div>
        <h3 className="text-base font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
          <GiSkills /> Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {
            (profileData?.skills.length ?? 0) > 0 ?
            profileData?.skills.map((skill) => (
              <Badge key={skill} value={skill} />
            ))
            : <p>-</p>
          }
        </div>
      </div>
    </div>
  );
};

const ProfileDetail = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-2">
    <div className="mt-0.5 text-gray-500 dark:text-gray-400">{icon}</div>
    <div>
      <div className="font-medium text-gray-800 dark:text-gray-100">{label}:</div>
      <div>{value}</div>
    </div>
  </div>
);
