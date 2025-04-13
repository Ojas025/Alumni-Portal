import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import { Chat } from "../models/chat.models";
import APIResponse from "../utils/APIResponse";
import APIError from "../utils/APIError";
import User from "../models/user.models";
import { Message } from "../models/message.models";
import mongoose from "mongoose";

export const handlegetAllChats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId){
        throw new APIError(400, "Unauthorized request");
    }

    const chats = await Chat.find({ participants: userId })
        .populate({
            path: 'participants',
            select: 'firstName lastName role profileImageURL _id'
        })
        .populate({
            path: 'lastMessage',
            select: 'content sender createdAt',
            populate: {
                path: 'sender',
                select: 'firstName lastName _id', 
            }
        }).lean().sort({ updatedAt: -1 });

    res
        .status(200)
        .json(new APIResponse(200, chats, "Chats fetched Successfully!"));
});

export const handleFetchUsers = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const search = req.query.query;

    if (!search) throw new APIError(400, "Search query is required");

    const users = await User.find({ 
        firstName: { $regex: search, $options: 'i' },         
        lastName: { $regex: search, $options: 'i' },         
    }).lean().select("firstName lastName _id profileImageURL role");   
    
    const payload = users.filter(user => user._id.toString() !== userId?.toString());
    
    res
        .status(200)
        .json(new APIResponse(200, payload, "Users fetched successfully"));
});

export const handleFetchOrCreateNewChat = asyncHandler(async (req, res) => {
    const { receiverId } = req.params;
    const userId = req.user?._id;

    if (!receiverId) throw new APIError(400, "receiverId is required");

    // Check if the chat is with yourself
    // query the chat
    // If !chat, create a new one 
    // else return the existing
    // If creating a new chat, notify the chat participants about it   

    if (receiverId.toString() === String(userId)) throw new APIError(400, "Cannot chat with yourself");

    const chat = await Chat.findOne({ participants: { $all: [receiverId, userId] } }).lean().populate("participants", "firstName lastName _id role profileImageURL");

    if (chat){
        res
            .status(200)
            .json(new APIResponse(200, chat, "Chat fetched successfully"));
    }
    else {

        const unreads = [{ user: userId, count: 0 },{ user: receiverId, count: 0 }]; 

        const newChat = await Chat.create({
            participants: [receiverId, userId],
            unreadCount: unreads
        });

        const payload = await Chat.findById(newChat._id).lean().populate( 
            { path: "participants", select: "firstName lastName _id profileImageURL role" },
        ).populate(
            { path: "lastMessage", select: "content sender _id createdAt", populate: { path: "sender", select: "firstName lastName _id" } },            
        );

        res
            .status(201)
            .json(new APIResponse(201, payload, "Created chat successfully"));
    }

});

export  const handleDeleteChat = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user?._id;

    if (!chatId) throw new APIError(400, "chatId is required");

    const chat = await Chat.findById(chatId).lean();

    if (!chat?.participants.some(id => id.equals(userId?.toString()))) throw new APIError(400, "Unauthorized request");

    const deletedChat = await Chat.findByIdAndDelete(chatId).lean();

    if (!deletedChat) throw new APIError(404, "Chat not found");

    // Delete messages belonging to this chat
    // Emit delete event to participants

    await Message.deleteMany({ chat: chatId });
    
    res
        .status(200)
        .json(new APIResponse(200, null, "Chat deleted successfully!"));
});

export const handleResetUnreadCount = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    
    if (!chatId) throw new APIError(400, "chatId is required");

    // This only updates the unreadCount for the current user
    // arrayFilter filters out the current user
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            $set: { "unreadCount.$[element].count": 0 },
        },
        { arrayFilters: [{ "element.user": req.user?._id?.toString() }], new: true, runValidators: true }
    ).lean().populate(
        { path: "participants", select: "firstName lastName _id profileImageURL role" },
    ).populate(
        { path: "lastMessage", select: "content sender _id createdAt", populate: { path: "sender", select: "firstName lastName _id" } },            
    );

    if (!updatedChat) throw new APIError(404, "Could not find chat");

    res
        .status(200)
        .json(new APIResponse(200, updatedChat, "unreadCount successfully reset"));
});

