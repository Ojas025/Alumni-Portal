import { SearchbarTemplate } from "@/components/Utils/SearchbarTemplate"
import { Pagination } from "@/components/Utils/Pagination"
import { useEffect, useState } from "react";
import { AlumniCard } from "./AlumniCard";
import { useAuthorize } from "@/hooks/useAuthorize";
import { useNotification } from "@/hooks/useNotification";
import axios from "axios";
import { Spinner } from "@/components/ui/Spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";

export interface Alumni {
  firstName: string;
  lastName: string;
  _id: string;
  profileImageURL: string;
  batch: string;
  bio: string;
  skills: string[];
  location: string;
  jobTitle: string;
  company: string;
}

export const AlumniDirectory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");   
  const [Loading, setLoading] = useState(false);   
  const [alumniProfiles, setAlumniProfiles] = useState<Alumni[]>([]);  
  const { notify } = useNotification(); 
  const { user, loading } = useSelector((state: RootState) => state.user);
  useAuthorize();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {

    const fetchAlumniProfiles = async () => {
      if (!loading && !user) return;

      try {
        setLoading(true);

        const result = await axios.get(
          `http://localhost:3000/api/user/profile/alumni?page=${currentPage}&limit=${10}&search=${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }            
          }
        )

        setAlumniProfiles(result.data.data.alumnis);
        setTotalPages(result.data.data.totalPages);

        notify({ id: 'alumni-toast', type: 'success', content: 'Successfully fetched alumnis' }); 
        
      } catch (error) {
        console.error("Could not fetch alumni profiles", error);
        notify({ id: 'alumni-toast', type: 'error', content: 'Could not fetch Alumnis' })  
      }
      finally {
        setLoading(false);
      }
    };

    fetchAlumniProfiles();
  }, [searchQuery, currentPage]);

  return (
    <div className="dark:bg-[#000000] bg-[#e6e9da] w-full min-h-screen flex flex-col items-center pb-6">

      <div className="space-y-2 py-6 w-full bg-gray-50 px-12 dark:bg-[#151515]">
        <h2 className="text-3xl font-bold dark:text-white text-black">Alumni Directory</h2>
        <p className="dark:text-gray-300 text-gray-700">Find and connect with Alumni</p>
      </div>

      <SearchbarTemplate placeholder="Search by name, skills or company" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>

      <div className="w-full px-4 md:px-30 py-6 space-y-8">
          {
            Loading ? <Spinner /> :
            alumniProfiles.map((alumni, index) => (
              <AlumniCard key={index}
                firstName={alumni.firstName}
                lastName={alumni.lastName}
                profileImageURL={alumni.profileImageURL}
                _id={alumni._id}
                jobTitle={alumni.jobTitle}
                company={alumni.company}
                location={alumni.location}
                batch={alumni.batch}
                bio={alumni.bio}
                skills={alumni.skills}
              />
            ))
          }
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

    </div>
  )
}
