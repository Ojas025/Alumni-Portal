import { SearchbarTemplate } from "@/components/Utils/SearchbarTemplate"
import { JobCard } from "./JobCard"
import { Pagination } from "@/components/Utils/Pagination"
import { useEffect, useState } from "react";
import { useAuthorize } from "@/hooks/useAuthorize";
import axios from "axios";
import { useNotification } from "@/hooks/useNotification";
import { Spinner } from "@/components/ui/Spinner";
import { JobForm } from "./JobForm";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  createdAt: string; 
  jobType: string; 
  skills: string[];
  owner: {
    firstName: string;
    lastName: string;
    _id: string;
    role: string;
    profileImageURL: string;
  }
  salary: string;
  url: string;
  description: string;
}


export const Jobs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [Loading, setLoading] = useState(false);
  const [formVisibility, setFormVisibility] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<string>('');
  const [jobs, setJobs] = useState<Job[]>([]);  
  const [searchQuery, setSearchQuery] = useState("");
  const { notify } = useNotification(); 
  const location = useLocation();
  const { user, loading } = useSelector((state: RootState) => state.user);

  const isJobPage = location.pathname === '/jobs';

  useAuthorize();

  useEffect(() => {
    
    const fetchJobs = async () => {
      if (!user && !loading) return;

      try {
        if (!isJobPage) return;
        setLoading(true);

        const result = await axios.get(
          `http://localhost:3000/api/job?page=${currentPage}&limit=${10}&search=${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );
        
        const jobs = result.data.data.jobs;
        
        setJobs(jobs);
        setTotalPages(result.data.data.totalPages);
        notify({ id: 'job-toast', type: 'success', content: 'Jobs fetched successfully' });
        
      } catch (error) {
        console.error('Error fetching jobs', error);
        notify({ id: 'job-toast', type: 'error', content: 'Could not fetch Jobs' });
      }
      finally {
        setLoading(false);
      }
    }

    fetchJobs();

  }, [currentPage, searchQuery, isJobPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const deleteJob = async (_id: string) => {
    try {
      setLoading(true);

      await axios.delete(
        `http://localhost:3000/api/job/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      
      setJobs(prev => prev.filter(job => job._id !== _id));
      notify({ id: 'job-toast', type: 'success', content: 'Job deleted successfully' });
      
    } catch (error) {
      console.error('Error deleting job', error);
      notify({ id: 'job-toast', type: 'error', content: 'Could not delete job' });
    }
    finally {
      setLoading(false);
      setJobToEdit("");
    }
  };

  return (
    <div className="dark:bg-[#000000] bg-[#e6e9da] w-full min-h-screen flex flex-col items-center pb-6">

      {
        formVisibility ?
        <JobForm setJobs={setJobs} setFormVisibility={setFormVisibility} jobId={jobToEdit}/>  
        : <>
      <div className="space-y-2 flex justify-between items-center py-6 w-full bg-gray-50 px-12 dark:bg-[#151515]">
        <div>
          <h2 className="text-3xl font-bold dark:text-white text-black">Job Board</h2>
          <p className="dark:text-gray-300 text-gray-700">Find and apply to jobs posted by alumni</p>
        </div>

         {
          ["alumni", "admin"].includes(user?.role || "") &&
          <button className="text-sm dark:text-black text-white dark:bg-white bg-black px-2 py-1 rounded-sm cursor-pointer font-semibold" onClick={() => {
            setJobToEdit("");            
            setFormVisibility(prev => !prev);
          }}>
            Post Job
          </button>
         } 

      </div>

      <SearchbarTemplate placeholder="Search jobs by title, description or company" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>

      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6 px-4 md:px-10 py-6">
      {
          Loading ?
          <div className="col-span-4">
            <Spinner /> 
          </div> 
          : jobs.length > 0 ? (
            jobs.map((job, index) => (
              <JobCard key={index}
                job={job}
                setJobToEdit={setJobToEdit}
                setFormVisibility={setFormVisibility}
                deleteJob={deleteJob}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 dark:text-gray-300">No jobs found</div>
          )
        }
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      </>

      }
    </div>
  )
}
