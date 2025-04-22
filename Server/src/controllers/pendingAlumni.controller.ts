import { Request, Response } from "express";
import APIResponse from "../utils/APIResponse";
import asyncHandler from "../utils/AsyncHandler";
import APIError from "../utils/APIError";
import PendingAlumni from "../models/pendingAlumni.models";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../services/cloudinary";
import User, { IUser } from "../models/user.models";

export const handleAddPendingAlumni = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
      email,
      password,
      github,
      linkedin,
      batch,
      dob,
      college,
      document,
    } = req.body;
    const documentPath = req.file?.path;

    const existingUser = await PendingAlumni.findOne({ email: email });

    if (existingUser) {
      throw new APIError(400, "User already exists");
    }

    const [day, month, year] = dob.split("/").map(Number);
    if (!day || !month || !year) {
      throw new APIError(400, "Invalid date format. Please use dd/mm/yyyy.");
    }

    const DOB = new Date(year, month - 1, day);

    const payload: { [key: string]: any } = {};
    if (firstName !== undefined) payload.firstName = firstName;
    if (lastName !== undefined) payload.lastName = lastName;
    if (email !== undefined) payload.email = email;
    if (password !== undefined) payload.password = password;
    if (github !== undefined) payload.github = github;
    if (linkedin !== undefined) payload.linkedin = linkedin;
    if (batch !== undefined) payload.batch = batch;
    if (dob !== undefined) payload.dob = DOB;
    if (college !== undefined) payload.college = college;

    if (documentPath) {
      const cloudinaryResponse = await uploadFileToCloudinary(documentPath);

      if (!cloudinaryResponse) {
        throw new APIError(500, "Failed to upload document");
      }

      payload.document = cloudinaryResponse.url;
    }

    await PendingAlumni.create(payload);

    const user = await PendingAlumni.findOne({ email: email })
      .select("-password")
      .populate("college")
      .lean();

    if (!user) {
      throw new APIError(400, "Error adding alumni");
    }

    res
      .status(201)
      .json(new APIResponse(201, user, "Added pending alumni successfully"));
  }
);

export const handleFetchAllPendingAlumnis = asyncHandler(
  async (req: Request, res: Response) => {
    const alumnis = await PendingAlumni.find({})
      .lean()
      .select("-password")
      .populate("college");

    res
      .status(200)
      .json(
        new APIResponse(
          200,
          alumnis,
          "Successfully fetched all pending alumnis"
        )
      );
  }
);

// export const handleFetchPendingAlumniById = asyncHandler(async (req: Request, res: Response) => {

//     res
//         .status(200)
//         .json(new APIResponse(200, [], "Successfully fetched all colleges"));
// });

export const handleVerifyPendingAlumni = asyncHandler(
  async (req: Request, res: Response) => {
    const { alumniId, response } = req.body;

    if (!alumniId || !response)
      throw new APIError(400, "alumniId and response is required");
    if (!["accept", "reject"].includes(response.toLowerCase()))
      throw new APIError(400, "Response must be accept/reject");

    const existingAlumni = await PendingAlumni.findById(alumniId).lean();

    if (!existingAlumni) throw new APIError(404, "Alumni not found");

    const publicId = existingAlumni.document?.split("/")?.pop()?.split(".")[0];
    if (publicId) {
      await deleteFileFromCloudinary(publicId);
    }

    const payload = {
      firstName: existingAlumni.firstName,
      lastName: existingAlumni.lastName,
      email: existingAlumni.email,
      password: existingAlumni.password,
      github: existingAlumni.github,
      linkedin: existingAlumni.linkedin,
      role: "alumni",
      college: existingAlumni.college,
      dob: existingAlumni.dob,
      batch: existingAlumni.batch,
      passwordHashed: true,
    };

    let newAlumni: IUser | null = null;
    if (response.toLowerCase() === "accept") {
      // Create a new user
      newAlumni = await User.create(payload);
    }

    const alumni = newAlumni
      ? await User.findById(newAlumni._id)
          .lean()
          .select("-password -refreshToken")
      : null;

    // Delete the pending alumni
    await PendingAlumni.findByIdAndDelete(alumniId);

    res
      .status(200)
      .json(
        new APIResponse(200, alumni, "Successfully verified alumni request")
      );
  }
);
