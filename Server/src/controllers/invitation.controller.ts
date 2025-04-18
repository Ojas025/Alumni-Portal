import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import APIError from "../utils/APIError";
import User from "../models/user.models";
import Invitation, { IInvitation } from "../models/invitation.models";
import APIResponse from "../utils/APIResponse";

export const handleAcceptInvitation = asyncHandler(async (req: Request, res: Response) => {
    const { invitationId } = req.params;

    if (!invitationId) throw new APIError(400, "invitationId is required");

    const invitation = await Invitation.findByIdAndUpdate(
        invitationId,
        {
            $set: { status: 'accepted' }
        },
        {
            new: true, runValidators: true
        }
    ) as IInvitation;

    if (!invitation) throw new APIError(404, "Invitation not found");

    await User.findByIdAndUpdate(
        invitation.sender,
        {
            $addToSet: { connections: req.user?._id },
        },
        {
            new: true, runValidators: true
        }
    )

    const updatedUser = await User.findByIdAndUpdate(
        invitation.receiver,
        {
            $addToSet: { connections: invitation.sender },
        },
    ).select("-password -refreshToken");

    res
        .status(200)
        .json(new APIResponse(200, { invitation: invitation, user: updatedUser }, "Invitation accepted successfully"));
});     

export const handleRejectInvitation = asyncHandler(async (req: Request, res: Response) => {
    const { invitationId } = req.params;

    if (!invitationId) throw new APIError(400, "invitationId is required");

    const invitation = await Invitation.findByIdAndUpdate(
        invitationId,
        {
            $set: { type: 'rejected' }
        },
        {
            new: true, runValidators: true
        }
    ).lean();

    console.log(invitationId);
    if (!invitation) throw new APIError(404, "Invitation not found");

    res
        .status(200)
        .json(new APIResponse(200, invitation, "Invitation rejected successfully"));
});    

export const handleFetchPendingInvitations = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;

    const invitations = await Invitation.find({
        receiver: userId,
        status: 'pending'
    }).populate('sender', 'firstName lastName _id profileImageURL').lean();

    res
        .status(200)
        .json(new APIResponse(200, invitations, "Pending invitations fetched successfully"));        
}); 

export const handleSendInvitation = asyncHandler(async (req: Request, res: Response) => {
    const { receiverId, type } = req.body;
    const userId = req.user?._id as string;
    
    if (!receiverId || !type) throw new APIError(400, "receiverId and type is required");

    const validTypes = ['connection', 'mentorship']; 

    if (!validTypes.includes(type)) {
        throw new APIError(400, "Invalid invitation type.");
    }

    const receiver = await User.findById(receiverId).lean();

    if (!receiver) throw new APIError(404, "Receiver not found");

    const existingInvitation = await Invitation.findOne({
        sender: userId,
        receiver: receiverId,
        type,
        status: 'pending'
    }).lean();

    if (existingInvitation) {
        throw new APIError(400, `You already have a pending ${type} invitation to this user.`);
    }

    const invitation = await Invitation.create({
        sender: userId,
        receiver: receiverId,
        type,
        status: 'pending' 
    });

    if (!invitation) throw new APIError(400, "Could not create an invitation");

    const populatedInvitation = await Invitation.findById(invitation._id).lean().populate('sender', 'firstName lastName profileImageURL _id').populate('receiver', 'firstName lastName profileImageURL _id'); 

    res
        .status(201)
        .json(new APIResponse(200, populatedInvitation, "Invitation sent successfully"));
});     