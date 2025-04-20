import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import Article from "../models/article.models";
import APIResponse from "../utils/APIResponse";
import APIError from "../utils/APIError";
import User from "../models/user.models";
import { pagination } from "../utils/Pagination";
import { summarize } from "../services/summarizer";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../services/cloudinary";

export const handleFetchAllArticles = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string).toLowerCase() || "";
    // Create a mongoDB filter
    const filter = { 
        ...(search && {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } }
            ]
        })
    };

    const total = await Article.countDocuments(filter);
    const { startIndex, next, prev, totalPages } = pagination(page, limit, total);

    const articles = await Article.find(filter).populate("author", "firstName role lastName profileImageURL _id").skip(startIndex).limit(limit).lean();

    res
        .status(200)
        .json(new APIResponse(200, { articles, totalPages, totalResults: total, pagination: { prev, next } }, "Successfully fetched all articles"));
});

export const handleFetchArticlesByUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string).toLowerCase() || "";
        
    // Create a mongoDB filter
    const filter = { 
            author: userId,
            ...(search && {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { author: { $regex: search, $options: "i" } },
                    { content: { $regex: search, $options: "i" } },
                    { tags: { $regex: search, $options: "i" } }
                ]
            })
    };

    const total = await Article.countDocuments(filter);
    const { startIndex, next, prev, totalPages } = pagination(page, limit, total);

    if (!userId){
        throw new APIError(400, "userId is required");
    }

    const user = await User.findById(userId).lean();

    if (!user){
        throw new APIError(404, "Invalid userId");
    }

    const articles = await Article.find(filter).skip(startIndex).limit(limit).lean().populate("author", "_id role firstName lastName profileImageURL");
    
    res
        .status(200)
        .json(new APIResponse(200, { articles, totalPages, totalResults: total, pagination: { prev, next } }, "Fetched user articles successfully"));
});

export const handlePostArticle = asyncHandler(async (req: Request, res: Response) => {
    const { content, author, title, tags, summary } = req.body;
    const thumbnailLocalPath = req.file?.path;
  
    if (!content || !author || !title || !summary) {
      throw new APIError(400, "Invalid data");
    }
  
    let thumbnailURL = "";
  
    if (thumbnailLocalPath) {
      const cloudinaryResponse = await uploadFileToCloudinary(thumbnailLocalPath);
      if (!cloudinaryResponse) {
        throw new APIError(500, "Error uploading thumbnail");
      }
      thumbnailURL = cloudinaryResponse.url;
    }
  
    const article = await Article.create({
      content,
      author,
      title,
      tags: tags || [],
      thumbnail: thumbnailURL,
      summary,
    });
  
    if (!article) {
      throw new APIError(400, "Error posting article");
    }
  
    const payload = await Article.findById(article._id)
      .populate("author", "firstName lastName role _id profileImageURL")
      .lean();
  
    res
      .status(201)
      .json(new APIResponse(201, payload, "Posted article successfully"));
  });
  

  export const handleDeleteArticle = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.params;
    const id = req.user?._id as string;
  
    if (!articleId) {
      throw new APIError(400, "articleId is required");
    }
  
    const article = await Article.findById(articleId).lean();
  
    if (!article) {
      throw new APIError(404, "Article not found");
    }
  
    if (article.author.toString() !== id.toString()) {
      throw new APIError(400, "Unauthorized request");
    }
  
    if (article.thumbnail) {

      const publicId = article.thumbnail.split("/").pop()?.split(".")[0];

      if (publicId) {
        await deleteFileFromCloudinary(publicId);
      }

    }
  
    await Article.deleteOne({ _id: articleId });
  
    res
      .status(200)
      .json(new APIResponse(200, "", "Deleted article successfully"));
  });
  

export const handleUpdateArticle = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.params;
    const { content, title, tags, thumbnail } = req.body;
    const userId = req.user?._id as string;
    const newThumbnailPath = req.file?.path;
  
    if (!articleId) {
      throw new APIError(400, "articleId is required");
    }
  
    const article = await Article.findById(articleId);
  
    if (!article) {
      throw new APIError(404, "Article not found");
    }
  
    if (article.author.toString() !== userId.toString()) {
      throw new APIError(403, "Unauthorized to update this article");
    }
  
    const updates: { [key: string]: any } = {};
    if (content !== undefined) updates.content = content;
    if (title !== undefined) updates.title = title;
    if (tags !== undefined && tags.length) updates.tags = tags;
  
    if (newThumbnailPath) {

      const publicId = article.thumbnail?.split("/")?.pop()?.split(".")[0];
      if (publicId) {
        await deleteFileFromCloudinary(publicId);
      }
  
      const cloudinaryResponse = await uploadFileToCloudinary(newThumbnailPath);

      if (!cloudinaryResponse) {
        throw new APIError(500, "Failed to upload new thumbnail");
      }
  
      updates.thumbnail = cloudinaryResponse.secure_url;
    }
  
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .lean()
      .populate("author", "firstName lastName profileImageURL _id role");
  
    if (!updatedArticle) {
      throw new APIError(400, "Article not found or unauthorized");
    }
  
    res
      .status(200)
      .json(new APIResponse(200, updatedArticle, "Successfully updated article"));
  });
       

export const handleFetchArticleById = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.params;
    
    if (!articleId){
        throw new APIError(404, "articleId is required");
    }

    const article = await Article.findById(articleId).lean().populate("author", "firstName lastName _id profileImageURL role");

    if (!article){
        throw new APIError(404, "Article not found");
    }

    res
        .status(200)
        .json(new APIResponse(200, article, "Article fetched successfully"));
});     

export const handleFetchArticleSummary = asyncHandler(async (req: Request, res: Response) => {
    const { text } = req.body;

    if (!text || text.trim() === '') throw new APIError(400, "Input text is required");
    
    const result = await summarize(text);
    console.log(result);

    if (!result) throw new APIError(400, "Error generating summary");

    res
        .status(200)
        .json(new APIResponse(200, result, "Summary generated successfully"));
});     