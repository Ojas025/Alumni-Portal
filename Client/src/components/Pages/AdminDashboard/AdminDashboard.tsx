import { useEffect, useState } from "react";
import { useNotification } from "@/hooks/useNotification";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { College } from "../Login/SignupForm";
import { FaArrowLeft, FaFileAlt } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

interface PendingAlumni {
  firstName: string;
  lastName: string;
  _id: string;
  document: string;
}

interface ICollege {
  name: string;
  address?: string;
  emailDomain?: string;
  logo: File | null;
}

export const AdminDashboard = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [pendingAlumni, setPendingAlumni] = useState<PendingAlumni[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [logoModal, setLogoModal] = useState(false);
  const [activeDocument, setActiveDocument] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const { notify } = useNotification();

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setLogo(acceptedFiles[0]);
      }
    },
  });

  useEffect(() => {
    const handleFetchColleges = async () => {
      try {
        const result = await axios.get("http://localhost:3000/api/college", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (result.status === 200 && result.data) {
          setColleges(result.data.data);
          notify({
            id: "college-toast",
            type: "success",
            content: "Fetched colleges successfully",
          });
        } else {
          throw new Error("Failed to fetch colleges");
        }
      } catch (error) {
        console.error(error);
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

        if (result.status === 200 && result.data.data) {
          setPendingAlumni(result.data.data);
          notify({
            id: "pending-alumni-toast",
            type: "success",
            content: "Fetched pending alumni successfully",
          });
        } else {
          throw new Error("Failed to fetch alumni");
        }
      } catch (error) {
        console.error(error);
        notify({
          id: "pending-alumni-toast",
          type: "error",
          content: "Error fetching pending alumni",
        });
      }
    };

    handleFetchPendingAlumni();
  }, []);

  const handleAddCollege = async (college: ICollege) => {
    console.log(college);
    const formData = new FormData();
    formData.append("name", college.name);
    formData.append("address", college.address || "");
    formData.append("emailDomain", college.emailDomain || "");
    if (college.logo) {
      formData.append("logo", college.logo);
    }

    try {
      console.log(name);
      const result = await axios.post(
        "http://localhost:3000/api/college",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (result.status !== 200) {
        notify({
          id: "college-toast",
          type: "error",
          content: "Error adding college",
        });
        return;
      }

      setName("");
      setAddress("");
      setEmailDomain("");
      setLogo(null);
      console.log(result.data);

      setColleges((prev) => [...prev, result.data]);

      notify({
        id: "college-toast",
        type: "success",
        content: "Added college successfully",
      });
    } catch (error) {
      console.error("Error adding college", error);
      notify({
        id: "college-toast",
        type: "error",
        content: "Error adding college",
      });
    }
  };

  const handleVerifyPendingAlumni = async (alumniId: string, response: string) => {
    try {

      const result = await axios.put('http://localhost:3000/api/pending-alumni',
        { alumniId, response },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (result.status !== 200){
        notify({
          id: "pending-alumni",
          type: "error",
          content: "Error verifying alumni",
        });
        return;
      }

      setPendingAlumni(prev => prev.filter(alumni => alumni._id !== alumniId));
      notify({
        id: "pending-alumni",
        type: "success",
        content: "Verified alumni successfully",
      });


    } catch (error) {
      console.error("Error verifying alumni", error);
      notify({
        id: "pending-alumni",
        type: "error",
        content: "Error verifying alumni",
      });
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-[#f0f2f5] dark:bg-[#121212] text-black dark:text-white">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-6 pr-0 lg:pr-4 border-b lg:border-b-0 lg:border-r border-gray-300 dark:border-gray-700">
          {/* College Form */}
          <div className="w-full lg:w-1/2 bg-white dark:bg-[#1e1e1e] p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Add College</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="w-full bg-gray-100 dark:bg-neutral-900 text-black dark:text-white px-3 py-2 rounded outline-none"
                />
              </div>

              <div>
                <label htmlFor="address" className="block mb-1 font-medium">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  className="w-full bg-gray-100 dark:bg-neutral-900 text-black dark:text-white px-3 py-2 rounded outline-none"
                />
              </div>

              <div>
                <label htmlFor="emailDomain" className="block mb-1 font-medium">
                  Email Domain
                </label>
                <input
                  type="text"
                  name="emailDomain"
                  onChange={(e) => setEmailDomain(e.target.value)}
                  value={emailDomain}
                  className="w-full bg-gray-100 dark:bg-neutral-900 text-black dark:text-white px-3 py-2 rounded outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">College Logo</label>
                <div
                  {...getRootProps()}
                  className="border border-dashed border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-neutral-900 p-4 text-center rounded cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <p>Click or drag to upload</p>
                </div>
              </div>

              <button
                type="button"
                className="w-full bg-black dark:bg-white dark:text-black text-white font-semibold py-2 rounded hover:opacity-90 transition cursor-pointer"
                onClick={() =>
                  handleAddCollege({
                    name: name,
                    address: address,
                    emailDomain: emailDomain,
                    logo: logo,
                  })
                }
              >
                Add
              </button>
            </form>
          </div>

          {/* College List */}
          <div className="w-full lg:w-1/2 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Colleges</h2>
            <div className="space-y-2">
              {colleges.map((college) => (
                <div
                  key={college._id}
                  className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm"
                >
                  {college.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {logoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4">
            <div className="relative bg-neutral-800 rounded-md p-6 w-full max-w-2xl max-h-[80vh] text-white shadow-lg">

              <button
                onClick={() => setLogoModal(false)}
                className="absolute top-2 -left-8 text-white cursor-pointer"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex justify-center items-center h-full">
                <img
                  src={activeDocument}
                  alt="College Logo Preview"
                  className="max-h-[60vh] max-w-full rounded shadow-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Right Side */}
        <div className="w-full lg:w-1/2 pt-6 lg:pt-0 pl-0 lg:pl-4">
          <h2 className="text-2xl font-bold mb-4">Pending Alumni Requests</h2>
          {pendingAlumni.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No pending requests.
            </p>
          ) : (
            <ul className="space-y-4 overflow-y-auto max-h-[calc(100vh-160px)] pr-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700">
              {pendingAlumni.map((alumni) => (
                <li
                key={alumni._id}
                className="flex justify-between items-center px-6 py-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm"
              >
                  <p className="text-black dark:text-sky-300 font-medium">
                    {alumni.firstName} {alumni.lastName}
                  </p>
              
                <div className="flex items-center gap-4">
                  <FaFileAlt
                    className="w-5 h-5 text-gray-500 dark:text-gray-300 cursor-pointer"
                    onClick={() => {
                      setLogoModal(true);
                      setActiveDocument(alumni.document);
                    }}
                  />
                  <IoCheckmark
                    onClick={() => handleVerifyPendingAlumni(alumni._id, 'accept')}
                    className="text-lime-400 w-5 h-5 cursor-pointer"
                  />
                  <RxCross2
                    onClick={() => handleVerifyPendingAlumni(alumni._id, 'reject')}
                    className="text-red-500 w-5 h-5 cursor-pointer"
                  />
                </div>
              </li>
              
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
