import { useEffect, useState } from "react";
import { College } from "../Login/SignupForm";
import { useNotification } from "@/hooks/useNotification";
import axios from "axios";

interface PendingAlumni {
  firstName: string;
  lastName: string;
  _id: string;
  document: File;
}

export const AdminDashboard = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [pendingAlumni, setPendingAlumni] = useState<PendingAlumni[]>([]);
  const { notify } = useNotification();

  useEffect(() => {
    const handleFetchColleges = async () => {
      try {
        const result = await axios.get("http://localhost:3000/api/college", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (result.status !== 200) {
          notify({
            id: "college-toast",
            type: "error",
            content: "Error fetching colleges",
          });
          return;
        }

        if (result.data) {
          setColleges(result.data);
        }

        notify({
          id: "college-toast",
          type: "success",
          content: "Fetched colleges successfully",
        });
      } catch (error) {
        console.error("Error fetching colleges", error);
        notify({
          id: "college-toast",
          type: "error",
          content: "Error fetching colleges",
        });
      }
    };

    handleFetchColleges();
  }, []);

  useEffect(() => {
    const handleFetchPendingAlumni = async () => {
      try {
        const result = await axios.get(
          "http://localhost:3000/api/pending-alumni",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (result.status !== 200) {
          notify({
            id: "pending-alumni-toast",
            type: "error",
            content: "Error fetching pending alumni",
          });
          return;
        }

        if (result.data.data) {
          setPendingAlumni(result.data.data);
        }

        notify({
          id: "pending-alumni-toast",
          type: "success",
          content: "Fetched pending alumni successfully",
        });
      } catch (error) {
        console.error("Error fetching colleges", error);
        notify({
          id: "pending-alumni-toast",
          type: "error",
          content: "Error fetching pending alumni",
        });
      }
    };

    handleFetchPendingAlumni();
  }, []);

  return (
    <div className="w-full min-h-screen p-6 bg-[#e6e9da] dark:bg-black">
      <h1 className="text-2xl font-bold mb-4">Pending Alumni Requests</h1>

      {
      ( pendingAlumni && pendingAlumni.length === 0) ? (
      <p>No pending requests.</p>
    ) : (
      <ul className="space-y-4">
        {pendingAlumni.map((alumni) => (
          <li
            key={alumni._id}
            className="border border-gray-300 rounded-md p-4 shadow-sm"
          >
            <p className="text-lg font-medium">{alumni.firstName} {alumni.lastName}</p>
            {/* You can add buttons for approval/rejection here */}
          </li>
        ))}
      </ul>
    )}


      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Colleges</h2>
        {
          colleges.length > 0 &&
        colleges.map((college) => (
          <div key={college._id} className="text-gray-700">
            {college.name}
          </div>
        ))}
      </div>
    </div>
  );
};
