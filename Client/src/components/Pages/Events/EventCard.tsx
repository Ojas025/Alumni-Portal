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
      const result = await axios.get(
        "http://localhost:5000/export-rsvps/eventId123",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          responseType: "blob",
        }
      );

      if (result.status !== 200) {
        throw new Error("Failed to export RSVP data");
      }

      const blob = new Blob([result.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "rsvps.xlsx";
      link.setAttribute("download", "rsvps.xlsx");
      document.body.appendChild(link);

      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting RSVP data:", error);
      notify({
        id: "export-toast",
        type: "error",
        content: "Error exporting rsvps",
      });
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
    <div className="w-full flex flex-col md:flex-row bg-white dark:bg-[#151515] rounded-sm shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition hover:shadow-lg relative">
      <div className="md:w-1/3 w-full h-60 md:h-60 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="object-cover object-center w-full h-full"
        />
      </div>

      <div className="flex flex-col justify-between md:w-2/3 w-full p-6 space-y-4 relative">
        <div className="absolute top-4 right-4 z-10">
          <BsThreeDotsVertical
            className="cursor-pointer w-5 h-5"
            onClick={() => setDropdownVisibility((prev) => !prev)}
          />
          {dropdownVisibility && isOwner && (
            <div
              id={`dropdown-${user._id}`}
              className="absolute right-0 mt-2 w-28 rounded-sm border border-black bg-white text-black text-xs shadow-lg dark:bg-black dark:border-white dark:text-white"
            >
              <div
                className="text-center py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer"
                onClick={handleExportRsvps}
              >
                Export RSVPs
              </div>
              <div
                className="text-center py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer"
                onClick={handleUpdateEvent}
              >
                Edit
              </div>
              <div
                className="text-center py-1 hover:bg-red-600 hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer"
                onClick={handleDeleteEvent}
              >
                Delete
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-1 dark:text-white">
            {event.title}
          </h2>
          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-2">
            <span>{new Date(event.date).toLocaleDateString()}</span>
            <span className="text-gray-400">•</span>
            <span>{event.time}</span>
            <span className="text-gray-400">•</span>
            <span>at {event.location}</span>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
          {event.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Entry Fee: { event.entryFee > 0? `₹${event.entryFee}` : 'Free'}
          </div>
          <button
            onClick={handleRsvpToEvent}
            className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-md dark:bg-white dark:text-black hover:opacity-90 transition"
          >
            RSVP
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
