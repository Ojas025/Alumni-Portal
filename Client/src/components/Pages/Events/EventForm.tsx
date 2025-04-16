import { useNotification } from "@/hooks/useNotification";
import { RootState } from "@/store/Store";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IoArrowBackOutline } from "react-icons/io5";
import { Spinner } from "@/components/ui/Spinner";
import { Event } from "./Events";

interface eventProps {
  setEvents: Dispatch<SetStateAction<Event[]>>;
  setFormVisibility: Dispatch<SetStateAction<boolean>>;
  eventId?: string | null;
}

export const EventForm = ({ setEvents, setFormVisibility, eventId }: eventProps) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | string>(""); // Date
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [entryFee, setEntryFee] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();
  const { user } = useSelector((state: RootState) => state.user);

  // Fetch existing event data if editing
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const data = res.data?.data;
        if (data) {
          setTitle(data.title);
          setLocation(data.location);
          setDate(data.date);
          setTime(data.time);
          setDescription(data.description);
          setEntryFee(data.entryFee);
        }
      } 
      catch (error) {
        console.error("Error fetching event", error);

        notify({
          id: "event error",
          type: "error",
          content: "Failed to fetch event data for editing",
        });
      } 
      finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (eventId) {

        const result = await axios.put(
          `http://localhost:3000/api/event/${eventId}`,
          { title, location, date, time, description, entryFee },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        notify({
          id: "event-toast",
          type: "success",
          content: "Event updated successfully",
        });

        setEvents((prev) =>
          prev.map((event) =>
            event._id === eventId ? result.data.data : event
        )
        );
      } 
      else {

        const result = await axios.post(
          "http://localhost:3000/api/event",
          {
            title,
            location,
            date,
            time,
            description,
            entryFee,
            owner: user?._id, // Assuming the owner is the logged-in user
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        notify({
          id: "event-toast",
          type: "success",
          content: "Event posted successfully",
        });

        setEvents((prev) => [...prev, result.data?.data]);
      }
    } catch (error) {
      console.error("Error saving event", error);
      notify({
        id: "event-toast",
        type: "error",
        content: "Could not save event",
      });
    } finally {
      setLoading(false);
      setFormVisibility(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="w-2/3 mx-auto m-6 p-6 rounded-md dark:bg-[#222] bg-white shadow-lg text-white space-y-4">
        <div className="flex items-center gap-4">
          <IoArrowBackOutline
            className="w-8 cursor-pointer h-8 dark:text-white text-black"
            onClick={() => {
              setFormVisibility((prev) => !prev);
              eventId = null;
            }}
          />
          <h2 className="text-3xl font-semibold dark:text-white text-black">
            {eventId ? "Edit Event" : "Post Event"}
          </h2>
        </div>
        <form className="space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-lg font-semibold block dark:text-white text-black">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter event title"
              className="rounded-sm px-2 py-2 text-sm bg-black dark:bg-white dark:text-black text-white w-full focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="text-lg font-semibold block dark:text-white text-black">
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="Enter event location"
              className="rounded-sm px-2 py-2 text-sm bg-black dark:bg-white dark:text-black text-white w-full focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-black"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="date" className="text-lg font-semibold block dark:text-white text-black">
              Date
            </label>
            <input
              type="date"
              name="date"
              className="rounded-sm px-2 py-2 text-sm bg-black dark:bg-white dark:text-black text-white w-full focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-black"
              value={new Date(date).toLocaleDateString().toString()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label htmlFor="time" className="text-lg font-semibold block dark:text-white text-black">
              Time
            </label>
            <input
              type="time"
              name="time"
              className="rounded-sm px-2 py-2 text-sm bg-black dark:bg-white dark:text-black text-white w-full focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-black"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          {/* Entry Fee */}
          <div className="space-y-2">
            <label htmlFor="entryFee" className="text-lg font-semibold block dark:text-white text-black">
              Entry Fee
            </label>
            <input
              type="number"
              name="entryFee"
              placeholder="Enter entry fee"
              className="rounded-sm px-2 py-2 text-sm bg-black dark:bg-white dark:text-black text-white w-full focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-black"
              value={entryFee}
              onChange={(e) => setEntryFee(Number(e.target.value))}
            />
          </div>

          {/* Description */}
          <div className="col-span-2 space-y-2">
            <label htmlFor="description" className="text-lg font-semibold block dark:text-white text-black">
              Description
            </label>
            <textarea
              rows={5}
              className="rounded-sm p-4 text-sm bg-black dark:bg-white text-white dark:text-black focus:outline-none focus:ring-2 resize-none dark:focus:ring-white focus:ring-black w-full"
              placeholder="Enter event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Submit */}
          <div className="col-span-2">
            {loading ? (
              <Spinner />
            ) : (
              <button
                className="dark:text-black text-white dark:bg-white bg-black px-3 py-2 rounded-sm cursor-pointer font-semibold w-full"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                {eventId ? "Update" : "Post"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
