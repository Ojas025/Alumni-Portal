import { Request, Response } from "express";
import APIError from "../utils/APIError";
import APIResponse from "../utils/APIResponse";
import asyncHandler from "../utils/AsyncHandler";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../services/cloudinary";
import College from "../models/college.models";

export const handleFetchAllColleges = asyncHandler(async (req: Request, res: Response) => {
    
    const colleges = await College.find({}).lean();

    res
        .status(200)
        .json(new APIResponse(200, colleges || [], "Successfully fetched all colleges"));
});

export const handleAddCollege = asyncHandler(async (req: Request, res: Response) => {
    const { name , emailDomain, address, logo }: { name: string, emailDomain: string, address: string, logo: string } = req.body;
    const logoPath = req.file?.path;

    const existingCollege = await College.findOne({ name: name });

    if (existingCollege) throw new APIError(400, "College already exists");

    if (!name) throw new APIError(400, "College name is required");
    const payload: { [key: string]: any } = { name: name.trim().toLowerCase(), emailDomain: emailDomain.trim(), address: address.trim() };  

    if (logoPath){
        const cloudinaryResponse = await uploadFileToCloudinary(logoPath);
    
        if (!cloudinaryResponse) {
          throw new APIError(500, "Failed to upload new thumbnail");
        }
    
        payload.logo = cloudinaryResponse.url;
    }
  
    const college = await College.create(payload);

    if (!college) throw new APIError(400, "Error adding college");

    res
        .status(200)
        .json(new APIResponse(200, college, "College added Successfully!"));
});

export const handleRemoveCollege = asyncHandler(async (req: Request, res: Response) => {
    const { collegeId } = req.params;

    if (!collegeId) throw new APIError(400, "collegeId is required");

    const college = await College.findById(collegeId).lean();

    if (!college) throw new APIError(404, "College not found");

    await College.findByIdAndDelete(collegeId);

    res
        .status(200)
        .json(new APIResponse(200, null, "College removed Successfully!"));
});

export const handleEditCollege = asyncHandler(async (req: Request, res: Response) => {
    const { name , emailDomain, address, logo }: { name: string, emailDomain: string, address: string, logo: string } = req.body;
    const { collegeId } = req.params;
    const logoPath = req.file?.path;

    const existingCollege = await College.findById(collegeId).lean();

    if (!existingCollege) throw new APIError(404, "College not found");

    if (!name) throw new APIError(400, "College name is required");

    const payload: { [key: string]: any } = {};
    
    if (name !== undefined) payload.name = name;
    if (emailDomain !== undefined) payload.emailDomain = emailDomain;
    if (address !== undefined) payload.address = address;

    if (logoPath){

        const publicId = existingCollege.logo?.split("/")?.pop()?.split(".")[0];
        if (publicId) {
            await deleteFileFromCloudinary(publicId);
        }

        const cloudinaryResponse = await uploadFileToCloudinary(logoPath);
    
        if (!cloudinaryResponse) {
          throw new APIError(500, "Failed to upload new logo");
        }
    
        payload.logo = cloudinaryResponse.url;
    }
  
    const college = await College.findByIdAndUpdate(collegeId, payload, { new: true });

    if (!college) throw new APIError(400, "Error updating college");

    res
        .status(200)
        .json(new APIResponse(200, college, "College updated Successfully!"));
});