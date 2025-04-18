import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/Utils/Badge";
import { useNotification } from "@/hooks/useNotification";
import { RootState } from "@/store/Store";
import { updateUser } from "@/store/userSlice";
import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  location?: string;
  batch?: string;
  role?: string;
  linkedin?: string;
  github?: string;
  skills: string[];
  languages: string[];
  department: string;
  company: string;
  jobTitle: string;
  availableForMentorship: boolean;
  projects: {
    title: string;
    url: string;
    description: string;
    technologiesUsed: string[];
  }[];
  projectTitle: string;
  projectUrl: string;
  projectDescription: string;
  technologies: string[];
  bio: string;
}

const getCoordinates = async (location: string) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location, 
          format: "json",
          addressdetails: 1,
          limit: 1, 
        },
      }
    );
    const data = response.data[0];
    if (data) {
      const lat = parseFloat(data.lat);
      const lon = parseFloat(data.lon);
      return [lat, lon];
    }
    return null;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

export const EditProfile = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newTech, setNewTech] = useState("");
  const dispatch = useDispatch();

  const defaultData: FormData = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    dob: user?.dob
      ? new Date(user.dob).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "",
    location: user?.location,
    batch: user?.batch.substring(0, 4),
    linkedin: user?.linkedin,
    github: user?.github,
    skills: user?.skills || [],
    languages: user?.languages || [],
    department: user?.department || "",
    jobTitle: user?.jobDetails?.title || "",
    company: user?.jobDetails?.company || "",
    availableForMentorship: user?.availableForMentorship || false,
    projects: [],
    projectTitle: "",
    projectUrl: "",
    projectDescription: "",
    technologies: [],
    bio: user?.bio ?? "",
  };

  const [formData, setFormData] = useState<FormData>(defaultData);

  const isModified = Object.keys(formData).some(
    (key) =>
      formData[key as keyof FormData]?.toString() !==
      defaultData[key as keyof FormData]?.toString()
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleUpdateProfile();
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const oldProjects = user.projects || []; 

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        skills: formData.skills,
        bio: formData.bio,
        jobDetails: {
          title: formData.jobTitle,
          company: formData.company
        },
        location: formData.location,
        batch: formData.batch,
        github: formData.github,
        linkedin: formData.linkedin,
        projects: [...formData.projects, ...oldProjects],
        languages: formData.languages,
        availableForMentorship: formData.availableForMentorship,
        department: formData.department,
        coordinates: [] as number[]
      }

      if (user.role === 'alumni' && payload.location){
        const coords = await getCoordinates(payload.location);

        if (coords) {
          payload.coordinates = coords;
        }  
      }

      const result = await axios.put(
        `http://localhost:3000/api/user/profile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const updatedUser = result.data?.data;

      if (updatedUser) {
        dispatch(updateUser(updatedUser));
        notify({
          id: "profile-toast",
          type: "success",
          content: "Profile updated successfully!",
        });
      }
    } catch (error) {
      console.error("Error updating profile", error);
      notify({
        id: "profile-toast",
        type: "error",
        content: "Could not update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      setNewSkill("");
    }
  };

  const handleAddLanguage = () => {
    const language = newLanguage.trim();
    if (language && !formData.languages.includes(language)) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, language],
      }));
      setNewLanguage("");
    }
  };

  const handleAddTech = () => {
    const tech = newTech.trim();
    if (tech && !formData.technologies.includes(tech)) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, tech],
      }));
    }
    setNewTech("");
  };

  const handleAddProject = () => {
    if (
      formData.projectTitle &&
      formData.projectUrl &&
      formData.projectDescription &&
      formData.technologies.length > 0
    ) {
      const newProject = {
        title: formData.projectTitle,
        url: formData.projectUrl,
        description: formData.projectDescription,
        technologiesUsed: formData.technologies,
      };

      setFormData((prev) => ({
        ...prev,
        projects: [...prev.projects, newProject],
        projectTitle: "",
        projectUrl: "",
        projectDescription: "",
        technologies: [],
      }));
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-neutral-800 text-center dark:text-white mb-2">
        Edit Profile
      </h2>

      <form
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col my-4 col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="resize-none px-4 py-2 rounded-md border text-sm outline-none transition 
            bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 
            text-black dark:text-white font-medium focus:ring-2 focus:ring-black dark:focus:ring-white"
              rows={4}
              placeholder="Tell us about yourself"
            />
          </div>

        {Object.entries(formData).map(([key, value]) =>
          key !== "skills" &&
          key !== "languages" &&
          key !== "availableForMentorship" &&
          key !== "projectDescription" &&
          key !== "projectTitle" &&
          key !== "projectUrl" &&
          key !== "projects" &&
          key !== "technologies" &&
          key !== "jobTitle" &&
          key !== "company" &&
          key !== "bio" ? (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())
                  .replace("Dob", "Date of Birth")}
              </label>

              <input
                type={
                  key === "email"
                    ? "email"
                    : key === "linkedin" ||
                      key === "github" ||
                      key === "department"
                    ? "url"
                    : "text"
                }
                placeholder={key === 'location' ? 'City, Country' : ''}
                name={key}
                value={value as string}
                onChange={handleChange}
                className={`px-4 py-2  rounded-md border text-sm outline-none transition 
                bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 
                ${
                  value === defaultData[key as keyof FormData]
                    ? "text-gray-500 dark:text-neutral-400"
                    : "text-black dark:text-white font-medium"
                } 
                focus:ring-2 focus:ring-black dark:focus:ring-white`}
              />
            </div>
          ) : null
        )}

        {(user?.role === "admin" || user?.role === "alumni") && (
          <>
            {/* Job Title */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle || ""}
                onChange={handleChange}
                className="px-4 py-2 rounded-md border text-sm outline-none transition 
            bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 
            text-black dark:text-white font-medium focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            {/* Company */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company || ""}
                onChange={handleChange}
                className="px-4 py-2 rounded-md border text-sm outline-none transition 
            bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 
            text-black dark:text-white font-medium focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            {/* Available For Mentorship */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Available for Mentorship
              </label>
              <select
                name="availableForMentorship"
                value={formData.availableForMentorship ? "true" : "false"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availableForMentorship: e.target.value === "true",
                  }))
                }
                className="px-4 py-2 rounded-md border text-sm outline-none transition 
            bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 
            text-black dark:text-white font-medium focus:ring-2 focus:ring-black dark:focus:ring-white"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </>
        )}

        {/*Skills  */}
        <div className="flex flex-col col-span-1">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
            Skills
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-4 py-2 rounded-md border text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="Enter a skill"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 rounded-md text-sm font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <Badge key={skill} value={skill} />
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-col col-span-1">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
            Languages
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              className="flex-1 px-4 py-2 rounded-md border text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="Add a language"
            />
            <button
              type="button"
              onClick={handleAddLanguage}
              className="px-4 py-2 rounded-md text-sm font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.languages.map((language) => (
              <Badge key={language} value={language} />
            ))}
          </div>
        </div>

        {/* Project section */}
        <div className="border-y border-gray-300 py-4 col-span-2 my-2">
            <h2 className="text-2xl my-2 font-semibold">Add Project</h2>

          <div className="flex flex-col my-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Title
            </label>
            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              className="px-4 py-2 rounded-md border text-sm outline-none transition 
            bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 
            text-black dark:text-white font-medium focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {/* Project URL */}
          <div className="flex flex-col my-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project URL
            </label>
            <input
              type="url"
              name="projectUrl"
              value={formData.projectUrl}
              onChange={handleChange}
              className="px-4 py-2 rounded-md border text-sm outline-none transition 
            bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 
            text-black dark:text-white font-medium focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {/* Project Description */}
          <div className="flex flex-col my-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Description
            </label>
            <textarea
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              className="px-4 py-2 rounded-md border text-sm outline-none transition 
            bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 
            text-black dark:text-white font-medium focus:ring-2 focus:ring-black dark:focus:ring-white"
              rows={4}
              placeholder="Describe your project here..."
            />
          </div>

          {/* Technologies Used */}
          <div className="flex flex-col my-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Technologies Used
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                name="newTech"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                className="flex-1 px-4 py-2 rounded-md border text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white"
                placeholder="Enter a technology"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <Badge key={index} value={tech} />
              ))}
            </div>
          </div>

          {/* Add Project Button */}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleAddProject}
              className="px-6 py-2 rounded-md font-semibold transition duration-200 bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
            >
              Add Project
            </button>
          </div>

          {/* Displaying Added Projects */}
          <div className="mt-8">
            {formData.projects.length > 0 ? (
              <div>
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  Your Projects
                </h3>
                <ul className="mt-4">
                  {formData?.projects.map((project, index) => (
                    <li key={index} className="mb-4">
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {project.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {project.description}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.url}
                        </a>
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {project.technologiesUsed.map((tech, idx) => (
                          <Badge key={idx} value={tech} />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        <div className="w-full flex justify-center mt-6 col-span-2">
          <button
            type="submit"
            disabled={!isModified || loading}
            className={`px-6 py-2 w-full rounded-md font-semibold transition duration-200 
            ${
              isModified && !loading
                ? "bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
                : "text-gray-400 bg-black dark:bg-white dark:text-gray-700 cursor-not-allowed"
            } ${loading ? "opacity-60 cursor-wait" : ""}`}
            onClick={handleUpdateProfile}
          >
            {loading ? <Spinner /> : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
};
