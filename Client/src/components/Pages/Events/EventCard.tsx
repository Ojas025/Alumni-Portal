import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Event } from "./Events";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import axios from "axios";
import { useNotification } from "@/hooks/useNotification";

interface EventCardInterface {
  event: Event;
  setEventToEdit: Dispatch<SetStateAction<string>>;
  setFormVisibility: Dispatch<SetStateAction<boolean>>;
  setEvents: Dispatch<SetStateAction<Event[]>>;
}

const EventCard = ({
  event,
  setEventToEdit,
  setFormVisibility,
  setEvents,
}: EventCardInterface) => {
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const { notify } = useNotification();

  const isOwner = user?._id === event.owner._id;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`#dropdown-${event.owner._id}`)) {
        setDropdownVisibility(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [event.owner._id]);

  const handleUpdateEvent = () => {
    setEventToEdit(event._id);
    setFormVisibility(true);
  };

  const handleDeleteEvent = () => {
    // deleteArticle(event._id);
  };

  const handleExportRsvps = async () => {
    try {

      const result = await axios.get('http://localhost:5000/export-rsvps/eventId123', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        responseType: 'blob'
      });

      if (result.status !== 200) {
        throw new Error('Failed to export RSVP data');
      }
      
      const blob = new Blob([result.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'rsvps.xlsx';  
      link.setAttribute('download', 'rsvps.xlsx');
      document.body.appendChild(link);

      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error exporting RSVP data:', error);
      notify({ id: 'export-toast', type: 'error', content: "Error exporting rsvps" })
    }
  };


  const handleRsvpToEvent = async () => {
    try {
      const result = await axios.post(
        `http://localhost:3000/api/event/register/${event._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (result.data.data) {
        setEvents((prev) => [
          ...prev.filter((event) => event._id !== result.data.data._id),
          result.data.data,
        ]);
        notify({
          id: "event-toast",
          type: "success",
          content: "Successfully rsvp'd to the event",
        });
      }
    } catch (error) {
      console.error("Error updating event", error);
      notify({
        id: "event-toast",
        type: "error",
        content: "Error rsvp'ing to the event",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-[#151515]  border rounded-xl p-6 shadow-sm hover:shadow-md transition relative">
      <div>
        <h2 className="text-lg font-semibold mb-1">{event.title}</h2>

        <div className="absolute top-6 right-2">
          <BsThreeDotsVertical
            className="cursor-pointer w-4 h-4"
            onClick={() => setDropdownVisibility((prev) => !prev)}
          />
          {dropdownVisibility && isOwner && (
            <div
              id={`dropdown-${user._id}`}
              className={`absolute top-2 right-6 z-20 w-20 rounded-sm border border-black bg-white text-black text-xs shadow-lg dark:bg-black dark:border-white dark:text-white`}
            >
              <div
                className="text-center w-full py-0.5 dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white  cursor-pointer rounded-t-sm"
                onClick={handleExportRsvps}
              >
                Export Rsvps
              </div>

              <div
                className="text-center w-full py-0.5 dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white  cursor-pointer rounded-t-sm"
                onClick={handleUpdateEvent}
              >
                Edit
              </div>

              <div
                className="cursor-pointer py-0.5 text-center dark:hover:bg-white hover:bg-black hover:text-white dark:hover:text-black  rounded-b-sm"
                onClick={handleDeleteEvent}
              >
                Delete
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-2">
        <div className="flex items-center gap-1">
          <span>{new Date(event.date).toLocaleDateString().toString()}</span>
        </div>
        <div className="text-gray-400">•</div>
        <div>{event.time}</div>
        <div className="text-gray-400">•</div>
        <div className="flex items-center gap-1">
          <span>at {event.location}</span>
        </div>
      </div>

      <div className="w-full h-60 mx-auto my-6 border rounded-lg dark:text-white text-black dark:bg-gray-600 bg-gray-300"></div>

      <p className="font-semibold mt-2">{event.description}</p>

      <button
        onClick={handleRsvpToEvent}
        className="px-4 py-1 bg-black dark:bg-white dark:text-black font-semibold cursor-pointer text-white rounded-md transition text-sm absolute bottom-6 right-8"
      >
        Rsvp
      </button>
    </div>
  );
};

export default EventCard;
