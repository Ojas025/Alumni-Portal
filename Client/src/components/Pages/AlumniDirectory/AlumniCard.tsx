import { Badge } from "@/components/Utils/Badge";
import { Alumni } from "./AlumniDirectory";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router";


export const AlumniCard = ({
  firstName,
  lastName,
  _id,
  profileImageURL,
  jobTitle,
  company,
  location,
  batch,
  skills,
  bio
}: Alumni) => {
  console.log(_id)
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition relative dark:bg-[#151515]">
      <div className="flex gap-4">
        <div>
          {
            profileImageURL ? 
            <img src={profileImageURL} alt="user" className="w-12 h-12 rounded-full" />
            : <FaUserCircle  className="w-12 h-12"/>
          }
        </div>

        <div className="flex-1">
          <Link to={`/profile/${_id}`} className="text-lg font-semibold">{firstName + ' ' + lastName}</Link>
          {
            jobTitle && company &&
            <p className="text-gray-600 dark:text-gray-400">{jobTitle} at {company}</p>
          }

          <p className="text-gray-700 dark:text-gray-400 m-2">{bio ?? ""}</p>

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
            
            {
              location &&
              <span>📍 {location}</span>
            }

            {
              batch &&  
              <Badge value={`${new Date(batch).getFullYear()} Batch`} />
            }  
          </div>


          {
            skills.length > 0 &&
            <div className="mt-3 flex flex-wrap gap-2 text-sm border-t pt-3 w-[90%] border-gray-300">
              {skills.map((skill, index) => (
                <Badge key={index} value={skill}/>
              ))}
            </div>
          }    

          <Link to={`/chat`} className="px-3 py-1 bg-black font-semibold cursor-pointer text-white rounded-md transition text-sm absolute top-6 right-26 dark:bg-white dark:text-black">
            Message
        </Link>
          <button className="px-3 py-1 bg-black font-semibold cursor-pointer text-white rounded-md transition text-sm absolute top-6 right-4 dark:bg-white dark:text-black">
            Connect
        </button>
        </div>
      </div>
    </div>
  );
};