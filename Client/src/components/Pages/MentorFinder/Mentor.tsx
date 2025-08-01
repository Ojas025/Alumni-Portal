import { useAuthorize } from "@/hooks/useAuthorize";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { useNotification } from "@/hooks/useNotification";
import { Spinner } from "@/components/ui/Spinner";
import { AlumniCard } from "../AlumniDirectory/AlumniCard";
// import { Spinner } from "@/components/ui/Spinner";
// import { Languages } from "lucide-react";

export interface Mentor {
  id: string;
  firstName?: string;
  lastName?: string;
  profileImageURL?: string;
  role?: string;
  location?: string;
  batch?: string;
  skills?: string[];
  bio?: string;
  languages?: string[];
  department?: string;
  projects?: Project[];
  availableForMentorship?: boolean;
  jobDetails?: JobDetails;
  linkedin?: string;
  github?: string;
  distance?: number;
}

interface Project {
  title?: string;
  description?: string;
  url?: string;
  technologiesUsed?: string[];
}

interface JobDetails {
  jobTitle?: string;
  company?: string;
}

export const Mentor = () => {
  useAuthorize();
  const [noteVisibility, setNoteVisibility] = useState(true);
  const { user, loading } = useSelector((state: RootState) => state.user);
  const [mentors, setMentors] = useState<Mentor[] | null>(null);
  const [Loading, setLoading] = useState(false);
  const { notify } = useNotification();

  const getMentors = async () => {
    if (!loading && !user) return;
    setLoading(true);
    
    const payload = {
      _id: user?._id ?? "",
      department: user?.department ?? "",
      languages: user?.languages ?? [],
      bio: user?.bio ?? "",
      skills: user?.skills ?? [],
      projects: user?.projects ?? [],
      role: user?.role ?? "student",
    }
    
    try {
      const result = await axios.post(
        "http://localhost:8081/api/mentor",
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
        },
      );

      
      if (result.data.length){
        setMentors(result.data);
        notify({ id: 'mentor-toast', type: 'success', content: 'Successfully fetched mentors' });
        console.log(result.data);
      }
      else{
        notify({ id: 'mentor-toast', type: 'error', content: 'Error fetching mentors' });
      }
    } catch (error) {
      console.error("Error fetching mentors", error);
      notify({ id: 'mentor-toast', type: 'error', content: 'Error fetching mentors' });
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen dark:bg-[#222] bg-[#e6e9da] dark:text-white text-black">
      {noteVisibility && (
        <div className="bg-[#ecde68] w-full h-max p-4 text-[#c28e0a] relative">
          <div className="h-4 w-full flex items-center justify-end mb-1">
            <RxCross2
              className="w-6 h-6 cursor-pointer"
              onClick={() => setNoteVisibility((prev) => !prev)}
            />
          </div>
          <p>
            <span className="font-bold text-lg">Important:</span> To ensure you
            receive the best mentor or mentees matches, please complete all
            sections of your profile. The more detailed and accurate your
            profile, the better the system can recommend relevant connections
            based on your skills, interests, and career goals. Incomplete
            profiles may result in less effective matches, so take a moment to
            update your information for an enhanced mentoring experience.
          </p>
        </div>
      )}

      {user?.role === "alumni" ? (
        <div>You are an Alumni. Why would you need a Mentor?</div>
      ) : (
        <div className="px-12 flex flex-col items-center">
          <div className="bg-yellow-100 p-6 rounded-xl shadow-md mt-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to the Mentor Finder!
            </h1>
            <p className="text-gray-700 mb-4">
              Mentor Finder connects students with alumni registered in the
              portal who can offer guidance and mentorship. Share your
              experiences and career goals to find the best fit.
            </p>
            <p className="text-gray-700 mb-4">
              Our goal is to foster strong mentor-mentee relationships that
              promote personal growth and career advancement.
            </p>
          </div>

          <div className="bg-yellow-50 my-8 shadow-md rounded-xl px-8 pt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Why Use Mentor Finder?
            </h2>
            <ul className="list-inside list-disc text-gray-700 text">
              <li className="mb-3">
                <strong>Tailored Mentorship:</strong> Get matched with mentors
                based on your professional and personal goals.
              </li>
              <li className="mb-3">
                <strong>Industry Insights:</strong> Learn from mentors with
                relevant industry experience.
              </li>
              <li className="mb-3">
                <strong>Career Growth:</strong> Build your network and gain
                valuable support from your mentors.
              </li>
            </ul>

            <div className="flex justify-center items-center my-8">
              <button
                className="px-6 py-3 text-black font-semibold bg-yellow-400 hover:bg-yellow-300 rounded-lg shadow-lg text-xl transition duration-200 ease-in-out cursor-pointer"
                onClick={getMentors}
              >
                {
                  Loading ? <Spinner /> :
                  <span>Get Mentors</span>
                }
              </button>
            </div>


          </div>
            {/* Mentor Card */}
            {
              mentors && mentors?.length > 0 &&
              <div className="w-4/5 bg-black rounded-xl p-18 flex flex-col items-center gap-8">
                {
                  Loading ? <Spinner /> :
                  mentors?.map(mentor => (
                    <AlumniCard key={mentor.distance} firstName={mentor.firstName ?? ""} lastName={mentor.lastName ?? ""} _id={mentor.id ?? ""} profileImageURL={mentor.profileImageURL ?? ""} company={mentor.jobDetails?.company ?? ""} bio={mentor.bio ?? ""} jobTitle={mentor.jobDetails?.jobTitle ?? ""} skills={mentor.skills ?? []} location={mentor.location ?? ""} batch={mentor.batch ?? ""}  />
                  ))
                }
              </div>
            }
        </div>
      )}
    </div>
  );
};
