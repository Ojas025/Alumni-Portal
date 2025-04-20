import { useNotification } from "@/hooks/useNotification";
import { RootState } from "@/store/Store";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IoArrowBackOutline } from "react-icons/io5";
import { Spinner } from "@/components/ui/Spinner";
import { Event } from "./Events";
import { useDropzone } from "react-dropzone";

interface eventProps {
  setEvents: Dispatch<SetStateAction<Event[]>>;
  setFormVisibility: Dispatch<SetStateAction<boolean>>;
  eventId?: string | null;
  setEventToEdit: Dispatch<SetStateAction<string>>;
}

export const EventForm = ({
  setEvents,
  setFormVisibility,
  eventId,
  setEventToEdit,
}: eventProps) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | string>(""); // Date
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [entryFee, setEntryFee] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const { notify } = useNotification();
  const { user } = useSelector((state: RootState) => state.user);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 1) {
        notify({
          id: "image-limit",
          type: "error",
          content: "Only one image is allowed. Using the first one.",
        });
      }
      setImage(acceptedFiles[0]);
    },
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/event/fetch/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const data = res.data?.data;
        if (data) {
          setTitle(data.title);
          setLocation(data.location);
          setDate(data.date);
          setTime(data.time);
          setDescription(data.description);
          setEntryFee(data.entryFee);
        }
      } catch (error) {
        console.error("Error fetching event", error);

        notify({
          id: "event error",
          type: "error",
          content: "Failed to fetch event data for editing",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("date", date.toString());
      formData.append("time", time);
      formData.append("description", description);
      formData.append("entryFee", entryFee.toString());
      if (image) formData.append("image", image);
      if (!eventId) formData.append("owner", String(user?._id));

      if (eventId) {
        const result = await axios.put(
          `http://localhost:3000/api/event/update/${eventId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "multipart/form-data",
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
      } else {
        const result = await axios.post(
          "http://localhost:3000/api/event",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "multipart/form-data",
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

  const isFormValid = title && location && date && time && description;

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950 py-10 px-4">
      <div className="w-full max-w-4xl mx-auto p-8 rounded-2xl bg-white dark:bg-neutral-900 shadow-xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <IoArrowBackOutline
            className="w-8 h-8 cursor-pointer dark:text-white text-black"
            onClick={() => {
              setFormVisibility((prev) => !prev);
              setEventToEdit("");
            }}
          />
          <h2 className="text-3xl font-semibold dark:text-white text-black">
            {eventId ? "Edit Event" : "Post Event"}
          </h2>
        </div>

        {/* Form */}
        <form className="space-y-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-lg font-semibold dark:text-white text-black">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter event title"
              className="rounded-md px-4 py-3 text-base bg-neutral-900 dark:bg-white dark:text-black text-white w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-lg font-semibold dark:text-white text-black">
              Location
            </label>
            <input
              type="text"
              placeholder="Enter event location"
              className="rounded-md px-4 py-3 text-base bg-neutral-900 dark:bg-white dark:text-black text-white w-full"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-lg font-semibold dark:text-white text-black">
              Date
            </label>
            <input
              type="date"
              className="rounded-md px-4 py-3 text-base bg-neutral-900 dark:bg-white dark:text-black text-white w-full"
              value={date as string}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label className="text-lg font-semibold dark:text-white text-black">
              Time
            </label>
            <input
              type="time"
              className="rounded-md px-4 py-3 text-base bg-neutral-900 dark:bg-white dark:text-black text-white w-full"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          {/* Entry Fee */}
          <div className="space-y-2">
            <label className="text-lg font-semibold dark:text-white text-black">
              Entry Fee
            </label>
            <input
              type="number"
              placeholder="Enter entry fee"
              className="rounded-md px-4 py-3 text-base bg-neutral-900 dark:bg-white dark:text-black text-white w-full"
              value={entryFee}
              onChange={(e) => setEntryFee(Number(e.target.value))}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-lg font-semibold dark:text-white text-black">
              Display Picture
            </label>
            <div
              {...getRootProps()}
              className="border border-dashed rounded-md p-5 text-center bg-gray-200 dark:bg-gray-700 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <input {...getInputProps()} />
              <p className="text-sm dark:text-white text-black">
                Drag & drop or click to select
              </p>
            </div>
            {image && (
              <p className="text-sm text-green-500">Image: {image.name}</p>
            )}
          </div>

          {/* Description - full width */}
          <div className="col-span-1 sm:col-span-2 space-y-2">
            <label className="text-lg font-semibold dark:text-white text-black">
              Description
            </label>
            <textarea
              rows={5}
              placeholder="Enter event description"
              className="rounded-md px-4 py-3 text-base bg-neutral-900 dark:bg-white dark:text-black text-white w-full resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 sm:col-span-2">
            {loading ? (
              <Spinner />
            ) : (
              <button
                disabled={!isFormValid}
                className="w-full cursor-pointer py-3 rounded-md text-lg font-semibold bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90 disabled:opacity-60 transition"
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
