import { Request, Response } from "express";
import { Message } from "../models/message.models";
import APIError from "../utils/APIError";
import APIResponse from "../utils/APIResponse";
import asyncHandler from "../utils/AsyncHandler";
import { Chat } from "../models/chat.models";
import mongoose from "mongoose";
import { ChatEventsEnum } from "../socket/chatEvents";
import { getSocketIdU } from "../socket/socket";

export const handleFetchMessagesByChatId = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId } = req.params;

    if (!chatId) {
      throw new APIError(400, "chatId is required");
    }

    const messages = await Message.find({ chat: chatId })
      .lean()
      .populate("sender", "firstName lastName _id role profileImageURL")
      .sort({ createdAt: 1 });

    res
      .status(200)
      .json(new APIResponse(200, messages, "Messages retrieved successfully"));
  }
);

export const handleSendMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { content, attachmentURL, attachmentType, fileName, fileSize } = req.body;

    if (!content && !attachmentURL) throw new APIError(400, "Message cannot be empty");

    if (!chatId) throw new APIError(400, "chatId is required");

    const chat = await Chat.findById(chatId);

    if (!chat) throw new APIError(404, "Chat not found");

    const message = await Message.create({
      content,
      sender: req.user?._id,
      chat: chatId,
      attachmentURL,
      attachmentType,
      fileName,
      fileSize
    });
    
    if (!message) throw new APIError(400, "Could not send message");

    chat.lastMessage = message._id as mongoose.Types.ObjectId;
    await chat.save();

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            $inc: { "unreadCount.$[element].count": 1 },
        },
        {
            arrayFilters: [{ "element.user": { $ne: req.user?._id } }],
            new: true,
            runValidators: true
        }
    )?.populate({
        path: "participants",
        select: "firstName lastName role profileImageURL _id",
      })
      .populate({
        path: "lastMessage",
        select: "content sender createdAt",
        populate: {
          path: "sender",
          select: "firstName lastName profileImageURL _id role",
        },
      });

    const populatedMessage = await Message.findById(message._id).lean().populate("sender", "firstName lastName _id role profileImageURL");  

    chat.participants.forEach(participant => {
      const socketId = getSocketIdU(participant._id.toString());
      if (participant._id.toString() !== req.user?._id?.toString()){

        if (socketId) {
          req.app.get('io').to(socketId).emit(ChatEventsEnum.RECEIVE_MESSAGE, populatedMessage);
        }
        
      } 
      if (socketId) req.app.get('io').to(socketId).emit(ChatEventsEnum.UPDATE_CHAT, updatedChat);
    });

    res
      .status(200)
      .json(new APIResponse(200, { message: populatedMessage, chat: updatedChat }, "Message sent successfully"));
  }
);

export const handleDeleteMessage = asyncHandler( async (req: Request, res: Response) => {
    const { messageId } = req.params;
    const userId = req.user?._id;

    if (!messageId) throw new APIError(400, "messageId is required");

    const message = await Message.findById(messageId);

    if (!message) throw new APIError(404, "Message not found");

    if (message?.sender.toString() !== userId?.toString()) throw new APIError(403, "Unauthorized request");

    await message?.deleteOne();
    const chat = await Chat.findById(message.chat);

    if (chat && message?._id?.toString() === chat?.lastMessage?.toString()){

        const lastMessage = await Message.findOne({ chat: message.chat }).sort({ createdAt: -1 }).lean();
        
        chat.lastMessage  = lastMessage?._id as mongoose.Types.ObjectId;
        await chat?.save();
    }

    res
      .status(200)
      .json(new APIResponse(200, null, "Message deleted  successfully"));
 });

export const handleEditMessage = asyncHandler( async (req: Request, res: Response) => {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id; 
        
    if (!content) throw new APIError(400, "content is required");
    if (!messageId) throw new APIError(400, "messageId is required");

    const message = await Message.findById(messageId);

    if (!message) throw new APIError(404, "Message not found");
    if (message?.sender.toString() !== userId?.toString()) throw new APIError(403, "Unauthorized request");

    message.content = content.trim();
    await message.save();

    
    const updatedMessage = await Message.findById(messageId).lean().populate("sender", "firstName lastName profileImageURL _id role");
    
    res
      .status(200)
      .json(new APIResponse(200, updatedMessage, "Message updated successfully"));
  }
); 
