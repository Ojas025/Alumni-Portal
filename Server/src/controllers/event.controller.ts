import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import Event from "../models/event.models";
import APIResponse from "../utils/APIResponse";
import APIError from "../utils/APIError";
import mongoose from "mongoose";
import XLSX from "xlsx";
import { pagination } from "../utils/Pagination";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../services/cloudinary";

export interface Results {
  next?: {
    page: number;
    limit: number;
  };
  prev?: {
    page: number;
    limit: number;
  };
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
}

export const handleFetchAllEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string).toLowerCase() || "";

    // Create a mongoDB filter
    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { owner: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await Event.countDocuments(filter);
    const { startIndex, next, prev, totalPages } = pagination(
      page,
      limit,
      total
    );

    const events = await Event.find(filter)
      .skip(startIndex)
      .limit(limit)
      .populate("owner", "_id role profileImageURL firstName lastName");

    const rsvpsByUser = await Event.find({ rsvps: req.user?._id }).lean();
    const formattedRsvps = rsvpsByUser.map((rsvp) => rsvp._id);   

    res.status(200).json(
      new APIResponse(
        200,
        {
          events,
          rsvpsByUser: formattedRsvps,
          totalPages,
          totalResults: total,
          pagination: { prev, next },
        },
        events.length ? "Events fetched successfully" : "No Events available"
      )
    );
  }
);

export const handleFetchEventsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new APIError(400, "userId is required");
    }

    const events = await Event.find({ owner: id }).lean();

    res
      .status(200)
      .json(
        new APIResponse(
          200,
          events,
          events.length ? "Events fetched successfully" : "No Events available"
        )
      );
  }
);

export const handlePostEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, location, date, time, description, entryFee } = req.body;
    const userId = req.user?._id;
    const imagePath = req.file?.path; 

    if (req.user?.role !== "alumni" && req.user?.role !== "admin") {
      throw new APIError(400, "Unauthorized request");
    }

    let imageURL = "";

    if (imagePath) {
      const cloudinaryResponse = await uploadFileToCloudinary(imagePath);
      if (!cloudinaryResponse) {
        throw new APIError(400, "Image upload failed");
      }

      imageURL = cloudinaryResponse.url;
    }

    const event = await Event.create({
      title,
      location,
      date,
      time,
      description,
      entryFee,
      owner: userId,
      image: imageURL,
      rsvps: [],
    });

    if (!event) {
      throw new APIError(400, "Error posting event");
    }

    res
      .status(201)
      .json(new APIResponse(201, event, "Event posted successfully"));
  }
);

export const handleDeleteEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const id = req.user?._id as string;

    if (!eventId) {
      throw new APIError(404, "eventId is required");
    }

    if (req.user?.role !== "alumni" && req.user?.role !== "admin") {
      throw new APIError(400, "Unauthorized request");
    }

    const event = await Event.findById(eventId).lean();

    if (!event) {
      throw new APIError(404, "Event not found");
    }

    if (event.owner.toString() !== id.toString()) {
      throw new APIError(400, "Unauthorized request");
    }

    if (event.image) {

      const publicId = event.image.split("/").pop()?.split(".")[0];

      if (publicId) {
        await deleteFileFromCloudinary(publicId);
      }
      
    }

    await Event.deleteOne({ _id: eventId });

    res
      .status(200)
      .json(new APIResponse(200, "", "Event deleted successfully"));
  }
);


export const handleUpdateEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const id = req.user?._id as string;
    const { title, location, date, time, description, entryFee, image } =
      req.body;
    const newImageLocalPath = req.file?.path as string;

    if (!eventId) {
      throw new APIError(400, "eventId is required");
    }

    if (req.user?.role !== "alumni" && req.user?.role !== "admin") {
      throw new APIError(400, "Unauthorized request");
    }

    const event = await Event.findById(eventId).lean();

    if (!event) {
      throw new APIError(404, "Event not found");
    }

    if (event.owner.toString() !== id.toString()) {
      throw new APIError(400, "Unauthorized request");
    }

    
    let publicId: string | undefined;
    let updatedImageURL = event.image;

    if (newImageLocalPath){
      if (event.image) {
        publicId = event.image.split("/").pop()?.split(".")[0];
      }
  
      if (publicId) {
        await deleteFileFromCloudinary(publicId);
      }

      const cloudinaryResponse = await uploadFileToCloudinary(newImageLocalPath);
      if (!cloudinaryResponse) throw new APIError(400, "Error uploading file");

      updatedImageURL = cloudinaryResponse.url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: { title, location, date, time, description, entryFee, image: updatedImageURL } },
      { new: true, runValidators: true }
    ).lean();

    res
      .status(200)
      .json(new APIResponse(200, updatedEvent, "Updated event successfully"));
  }
);

export const handleRsvpForEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const id = req.user?._id as string;

    if (!eventId) {
      throw new APIError(400, "eventId is required");
    }

    const event = await Event.findById(eventId);

    if (!event) {
      throw new APIError(400, "Event not found");
    }

    if (event.rsvps.some((userId) => userId.equals(id))) {
      throw new APIError(400, "Already rsvp'd");
    }

    event.rsvps.push(new mongoose.Types.ObjectId(id));

    await event.save();

    res
      .status(200)
      .json(
        new APIResponse(200, event, "Successfully registered for the event")
      );
  }
);

export const handleRemoveRsvp = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const id = req.user?._id as string;

    if (!eventId) {
      throw new APIError(400, "eventId is required");
    }

    const event = await Event.findById(eventId);

    if (!event) {
      throw new APIError(400, "Event not found");
    }

    if (event.rsvps.some((userId) => userId.equals(id))) {
      event.rsvps = event.rsvps.filter(
        (userId) => userId.toString() !== id.toString()
      );
    } else {
      throw new APIError(400, "No rsvp");
    }

    await event.save();

    res
      .status(200)
      .json(
        new APIResponse(200, event, "Successfully unregistered for the event")
      );
  }
);

export const handleFetchRsvpdEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user?._id;

    if (!id) {
      throw new APIError(403, "Unauthorized request");
    }

    const events = await Event.find({ rsvps: id });

    res
      .status(200)
      .json(new APIResponse(200, events, "Fetched rsvp'd events successfully"));
  }
);

export const handleFetchEventById = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;

    if (!eventId) {
      throw new APIError(400, "eventId is required");
    }

    const event = await Event.findById(eventId)
      .lean()
      .populate("owner", "firstName lastName _id role profileImageURL");

    if (!event) {
      throw new APIError(404, "Event not found");
    }

    res
      .status(200)
      .json(new APIResponse(200, event, "Event fetched successfully"));
  }
);

export const handleExportRsvps = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;

    if (!eventId) throw new APIError(400, "eventId is required");

    const event = await Event.findById(eventId).populate(
      "rsvps",
      "firstName lastName email"
    );

    if (!event) throw new APIError(404, "Event not found");

    if (!event.rsvps || event.rsvps.length === 0) {
      throw new APIError(400, "No RSVPs found for this event");
    }

    const rsvps = event.rsvps as unknown as IUser[];

    const userData = (
      event.rsvps as unknown as {
        firstName: string;
        lastName: string;
        email: string;
      }[]
    ).map((user) => ({
      FirstName: user.firstName,
      LastName: user.lastName,
      Email: user.email,
      Phone: "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(userData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RSVP'd users");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=rsvps.xlsx");

    res.send(XLSX.write(wb, { bookType: "xlsx", type: "buffer" }));
  }
);

// {}
