"use client";

import { Spinner } from "@/components/ui/Spinner";
import { useNotification } from "@/hooks/useNotification";
import { initializeSocket } from "@/socket";
import { mountSocketListeners } from "@/socket/listeners";
import { setSocket } from "@/store/socketSlice";
import { setUser } from "@/store/userSlice";
import axios from "axios";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

export const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState<File | null>(null);
  const { notify } = useNotification();

  const colleges = ['Sinhgad', 'AISSMS COE', 'COEP', 'Modern'];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    batch: "",
    role: "",
    linkedin: "",
    github: "",
    email: "",
    password: "",
    dob: "",
    college: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/signup",
        formData,
        { withCredentials: true }
      );
      const accessToken = response.data.data.accessToken;
      const refreshToken = response.data.data.refreshToken;
      const user = response.data.data.user;

      dispatch(setUser(user));

      if (!accessToken || !refreshToken) {
        throw new Error("Error while signing up");
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const socket = initializeSocket();

      if (!socket.connected) {
        socket.connect();
        mountSocketListeners(socket);
        dispatch(setSocket(socket));
      }

      notify({
        id: "signup-toast",
        type: "success",
        content: "Signed-up successfully",
      });
      navigate("/home");
    } catch (error) {
      console.error("SIGNUP_ERROR", error);
      notify({
        id: "signup-error",
        type: "error",
        content: "500: Signup Error",
      });
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length) {
          setDocument(acceptedFiles[0]);
        }
      },
      multiple: false,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
      },
    });

    const isSubmitDisabled = formData.role === "Alumni" && !document;

  return (
    <div className="w-full max-w-3xl mt-16 bg-white text-black rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Create Your Account
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full px-4 py-3 max-h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full px-4 py-3 max-h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
        />
        <input
          type="text"
          name="batch"
          placeholder="Batch"
          value={formData.batch}
          onChange={handleChange}
          className="w-full px-4 py-3 max-h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-3 max-h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white text-gray-600"
        >
          <option value="" disabled hidden>
            Select Role
          </option>
          <option value="Student">Student</option>
          <option value="Alumni">Alumni</option>
        </select>
        <input
          id="dob"
          type="text"
          name="dob"
          placeholder="Date of Birth"
          value={formData.dob}
          onChange={handleChange}
          className="w-full px-4 py-3 max-h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
        />
        <input
          type="text"
          name="linkedin"
          placeholder="LinkedIn Profile"
          value={formData.linkedin}
          onChange={handleChange}
          className="w-full px-4 py-3 max-h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
        />
        <input
          type="text"
          name="github"
          placeholder="GitHub Profile"
          value={formData.github}
          onChange={handleChange}
          className="w-full px-4 py-3 max-h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
        />

        <select
          name="college"
          value={formData.college}
          onChange={handleChange}
          className="w-full px-4 py-3 max-h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white text-gray-600"
        >
          <option value="" disabled hidden>
            Select College
          </option>
          {
            colleges.map((college, index) => (
              <option value={college} key={index}>{college}</option>
            ))
          }
        </select>

        {
          formData.role === 'Alumni' &&
          <div className="space-y-2 w-full">
            <label
              htmlFor="thumbnail"
              className="text-sm block text-gray-600 pl-2"
            >
              Alumni Proof ( College ID | Graduation certificate )
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed border-black rounded-md p-6 cursor-pointer transition ${
                isDragActive
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "bg-neutral-900 dark:bg-white"
              }`}
            >
              <input {...getInputProps()} />
              <p
                className={`text-sm text-center ${
                  isDragActive
                    ? "text-black dark:text-white"
                    : "text-white dark:text-black"
                }`}
              >
                {document
                  ? document.name
                  : "Drag and drop a file here, or click to select a file"}
              </p>
            </div>
          </div>  
          
        }

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 max-h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm md:col-span-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 max-h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm md:col-span-2"
        />
      </div>

      <button
        disabled={isSubmitDisabled}
        type="submit"
        className="w-full mt-6 cursor-pointer bg-black text-white py-3 rounded-lg font-medium transition duration-200"
        onClick={submitForm}
      >
        {loading ? <Spinner /> : "Sign Up →"}
      </button>
    </div>
  );
};
