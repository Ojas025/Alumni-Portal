import { Request, Response } from "express";
import APIResponse from "../utils/APIResponse";
import asyncHandler from "../utils/AsyncHandler";
import APIError from "../utils/APIError";
import PendingAlumni from "../models/pendingAlumni.models";
import { uploadFileToCloudinary } from "../services/cloudinary";

export const handleAddPendingAlumni = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, github, linkedin, batch, dob, college, document  } = req.body;
    const documentPath = req.file?.path;

    const existingUser = await PendingAlumni.findOne({ email: email });

    if (existingUser){
        throw new APIError(400, "User already exists");
    }   

    const [ day, month, year ] = dob.split("/").map(Number);
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

    if (documentPath){
        const cloudinaryResponse = await uploadFileToCloudinary(documentPath);
    
        if (!cloudinaryResponse) {
          throw new APIError(500, "Failed to upload document");
        }
    
        payload.document = cloudinaryResponse.url;
    }

    await PendingAlumni.create(payload);

    const user = await PendingAlumni.findOne({ email: email }).select("-password").populate('college').lean();

    if (!user){
        throw new APIError(400, "Error adding alumni");
    }

    res
        .status(201)
        .json(new APIResponse(201, user, "Added pending alumni successfully"));
});

export const handleFetchAllPendingAlumnis = asyncHandler(async (req: Request, res: Response) => {
    
    const alumnis = await PendingAlumni.find({}).lean().select('-password').populate('college');

    res
        .status(200)
        .json(new APIResponse(200, alumnis, "Successfully fetched all pending alumnis"));
});

export const handleFetchPendingAlumniById = asyncHandler(async (req: Request, res: Response) => {
    

    res
        .status(200)
        .json(new APIResponse(200, [], "Successfully fetched all colleges"));
});

export const handleVerifyPendingAlumni = asyncHandler(async (req: Request, res: Response) => {
    const { alumniId, response } = req.body; 

    if (!alumniId || !response) throw new APIError(400, "alumniId and response is required");
    
    const alumni = await PendingAlumni.findById(alumniId).lean();

    if (!alumni) throw new APIError(404, "Alumni not found");

    

    res
        .status(200)
        .json(new APIResponse(200, [], "Successfully fetched all colleges"));
});
