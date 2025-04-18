// // Fetch all active mentorships
// // Fetch all mentorships
// // Fetch mentorships for the current user
// // Request mentorship, student -> alumni
// // Respond to mentorship request, alumni -> student

// import { Request, Response } from "express";
// import asyncHandler from "../utils/AsyncHandler";
// import Mentorship from "../models/invitation.models";
// import APIResponse from "../utils/APIResponse";
// import APIError from "../utils/APIError";
// import User from "../models/user.models";
// import mongoose from "mongoose";

// export const handleFetchAllActiveMentorships = asyncHandler(async (req: Request, res: Response) => {
//     const mentorships = await Mentorship.find({ completionStatus: "active" }).populate("student").populate("alumni");

//     res
//         .status(200)
//         .json(new APIResponse(200, mentorships || [], "Successfully fetched all active mentorships"));
// });

// export const handleFetchAllMentorships = asyncHandler(async (req: Request, res: Response) => {
//     const mentorships = await Mentorship.find({ status: "accepted" }).populate("student").populate("alumni");

//     res
//         .status(200)
//         .json(new APIResponse(200, mentorships || [], "Successfully fetched all mentorships"));
// });

// export const handleRequestMentorship = asyncHandler(async (req: Request, res: Response) => {
//     const { mentorId } = req.params;

//     if (!mentorId){
//         throw new APIError(400, "mentorId is required");
//     }

//     const mentor = await User.findById(mentorId).select(" -password -refreshToken ").lean();

//     if (!mentor){
//         throw new APIError(400, "Mentor not found");
//     }

//     if (!mentor.availableForMentorship){
//         throw new APIError(400, "Mentor not available for mentorship");
//     }

//     if (mentor.role !== "alumni"){
//         throw new APIError(400, "Invalid mentorId");
//     }

//     const mentorshipRequest = await Mentorship.create({
//         student: req.user?._id,
//         alumni: mentor._id,
//         status: "pending",
//         completionStatus: "inactive"
//     });

//     res
//         .status(201)
//         .json(new APIResponse(201, mentorshipRequest, "Successfully requested for mentorship"));
// });

// export const handleRespondToMentorshipRequest = asyncHandler(async (req: Request, res: Response) => {
//     const { mentorshipId } = req.params;
//     const { status } = req.body;

//     if (!mentorshipId || !status){
//         throw new APIError(400, "Invalid data");
//     }

//     const mentorship = await Mentorship.findById(mentorshipId).lean();

//     if (!mentorship){
//         throw new APIError(400, "Mentorship not found");
//     }

//     if (mentorship.status !== "pending"){
//         throw new APIError(400, "Mentorship already responded to");
//     }

//     const completionStatus = status === "accepted"? "active" : "inactive";
//     const updatedMentorship = await Mentorship.findByIdAndUpdate(
//         mentorshipId,
//         { $set: { status: status, completionStatus: completionStatus } },
//         { new: true, runValidators: true }
//     );

//     if (!updatedMentorship){
//         throw new APIError(400, "Error updating mentorship request");
//     }

//     res
//         .status(200)
//         .json(new APIResponse(200, updatedMentorship, "Successfully updated mentorship request"));
// });

// export const handleGetPendingRequestsSent = asyncHandler(async (req: Request, res: Response) => {
//     const userId = req.user?._id as string;

//     if (!userId){
//         throw new APIError(400, "Unauthorized request");
//     }

//     const mentorshipRequests = await Mentorship.aggregate([
//         {
//             $match: {
//                 student: new mongoose.Types.ObjectId(userId),
//                 status: "pending"
//             }
//         },

//         {
//             $lookup: {
//                 from: "users",
//                 localField: "student",
//                 foreignField: "_id",
//                 as: "studentInfo"
//             }
//         },

//         {
//             $lookup: {
//                 from: "users",
//                 localField: "alumni",
//                 foreignField: "_id",
//                 as: "alumniInfo"
//             }
//         },

//         { $unwind: "$studentInfo" },
//         { $unwind: "$alumniInfo" },

//         {
//             $project: {
//                 _id: 1,
//                 status: 1,
//                 completionStatus: 1,
//                 "studentInfo.firstName": 1,
//                 "studentInfo.lastName": 1,
//                 "studentInfo.email": 1,
//                 "studentInfo.profileImageURL": 1,
//                 "studentInfo._id": 1,
//                 "alumniInfo.skills": 1,
//                 "alumniInfo.firstName": 1,
//                 "alumniInfo.lastName": 1,
//                 "alumniInfo.profileImageURL": 1,
//                 "alumniInfo._id": 1
//             }
//         }
//     ]);

//     res
//         .status(200)
//         .json(new APIResponse(200, mentorshipRequests || [], "Successfully fetched pending mentorship requests"));
// });