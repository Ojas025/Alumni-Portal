import { Request, Response } from "express";
import Tweet from "../models/tweet.models";
import asyncHandler from "../utils/AsyncHandler";
import { pagination } from "../utils/Pagination";
import APIResponse from "../utils/APIResponse";
import APIError from "../utils/APIError";
import { populate } from "dotenv";
import mongoose from "mongoose";

export const handleFetchAllTweets = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
        
    const total = await Tweet.countDocuments();
    const { startIndex, next, prev, totalPages } = pagination(page, limit, total);
    
    const tweets = await Tweet.find().sort({ createdAt: -1 }).skip(startIndex).limit(limit).populate("author", "profileImageURL firstName lastName role _id").lean();
    
    res
        .status(200)
        .json(new APIResponse(200, { tweets, totalPages, totalResults: total, pagination: { prev, next } }, "Tweets fetched successfully"))
});

export const handleFetchUserTweets = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        throw new APIError(400, "userId is required");
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
        
    const total = await Tweet.countDocuments({ author: userId });
    const { startIndex, next, prev, totalPages } = pagination(page, limit, total);

    const tweets = await Tweet.find({ author: userId }).sort({ createdAt: -1 }).skip(startIndex).limit(limit).populate("author", "profileImageURL role firstName lastName _id").lean();

    res
        .status(200)
        .json(new APIResponse(200, { tweets, totalPages, totalResults: total, pagination: { prev, next } }, "Tweets user fetched successfully"))
});

export const handleDeleteTweet = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId } = req.params;

    if (!tweetId){
        throw new APIError(400, "tweetId is required");
    }

    const tweet = await Tweet.findById(tweetId).lean();
    
    if (tweet?.author.toString() !== String(req.user?._id) && req.user?.role !== 'admin'){
        throw new APIError(403, "Unauthorized request");
    }

    await Tweet.findByIdAndDelete(tweetId);

    res
        .status(200)
        .json(new APIResponse(200, null, "Tweet deleted successfully"))
});

export const handleUpdateTweet = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    console.log(tweetId);

    if (!tweetId || !content){
        throw new APIError(400, "tweetId and content is required");
    }

    const tweet = await Tweet.findById(tweetId).lean();

    if (!tweet){
        throw new APIError(404, "Tweet does not exist");
    } 

    if (tweet.author.toString() !== String(req.user?._id)){
        throw new APIError(403, "Unauthorized request");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {  content },
        { new: true, runValidators: true }
    ).populate("author", "firstName lastName _id profileImageURL");

    if (!updatedTweet){
        throw new APIError(400, "Failed to update tweet"); 
    }    

    res
        .status(200)
        .json(new APIResponse(200, updatedTweet, "Updated tweet successfully"));
});

export const handlePostTweet = asyncHandler(async (req: Request, res: Response) => {
    const { content } = req.body;

    if (!content){
        throw new APIError(400, "Tweet content is required");
    }

    const tweet = await Tweet.create({
        author: new mongoose.Types.ObjectId(String(req.user?._id)),
        content,
    });

    if (!tweet){
        throw new APIError(400, "Could not post tweet");
    }

    const populatedTweet = await Tweet.findById(tweet._id).populate("author", "firstName role lastName _id profileImageURL").lean();

    res
        .status(201)
        .json(new APIResponse(201, populatedTweet, "Posted tweet successfully"));
});

// {}