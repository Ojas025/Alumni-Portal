import { SearchbarTemplate } from "@/components/Utils/SearchbarTemplate"
import EventCard from "./EventCard"
import { useEffect, useState } from "react";
import { Pagination } from "@/components/Utils/Pagination";
import { useAuthorize } from "@/hooks/useAuthorize";
import { useNotification } from "@/hooks/useNotification";
import axios from "axios";
import { Spinner } from "@/components/ui/Spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { EventForm } from "./EventForm";

export interface Event {
  _id: string;
  title: string;
  location: string;
  date: Date;
  time: string;
  owner: {
    firstName: string;
    lastName: string;
    _id: string;
    role: string;
    profileImageURL: string;
  };
  rsvps: string[];
  description: string;
  entryFee: number;
}

export const Events = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [Loading, setLoading] = useState(false);
  const [formVisibility, setFormVisibility] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventToEdit, setEventToEdit] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  console.log(eventToEdit);

  const { notify } = useNotification(); 
  const { user, loading } = useSelector((state: RootState) => state.user);
  
  useAuthorize();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {

    const fetchEvents = async () => {
      if (!loading && !user) return;

      try {
        setLoading(true);

        const result = await axios.get(
          `http://localhost:3000/api/event?page=${currentPage}&limit=${10}&search=${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }            
          }
        )

        setEvents(result.data.data.events);
        setTotalPages(result.data.data.totalPages);

        notify({ id: 'event-toast', type: 'success', content: 'Successfully fetched events' }); 
        
      } catch (error) {
        console.error("Could not fetch events", error);
        notify({ id: 'event-toast', type: 'error', content: 'Could not fetch events' })  
      }
      finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchQuery, currentPage]);

  return (
    <div className="dark:bg-[#000000] bg-[#e6e9da] w-full min-h-screen flex flex-col items-center pb-6">

      {
        formVisibility ?
        <EventForm setEvents={setEvents} setFormVisibility={setFormVisibility} />
        : <>
      <div className="space-y-2 flex justify-between items-center py-6 w-full bg-gray-50 px-12 dark:bg-[#151515]">
        <div>
          <h2 className="text-3xl font-bold dark:text-white text-black">Events</h2>
          <p className="dark:text-gray-300 text-gray-700">Insights, experiences, and advice from our alumni community</p>
        </div>

        {
          ["alumni","admin"].includes(user?.role || "") && 
          <button className="text-sm dark:text-black text-white dark:bg-white bg-black px-2 py-1 rounded-sm cursor-pointer font-semibold" onClick={() => setFormVisibility(prev => !prev)}>
            Post Event
          </button>
        }

      </div>

      <SearchbarTemplate placeholder="Search articles by title, author or description" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>

      <div className="my-6 w-full">
       {
        Loading ? <Spinner />
        : events.length === 0 ? <p>No events found</p> :
        <div className="w-full px-4 md:px-10 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:w-2/3">
            {
              events.map((event, index) => (
                <EventCard key={index}
                  setEvents={setEvents}
                  event={event}   
                  setEventToEdit={setEventToEdit}
                  setFormVisibility={setFormVisibility}
                />
              ))
            }
        </div>
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


