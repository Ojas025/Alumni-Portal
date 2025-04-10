import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import Article from "../models/article.models";
import APIResponse from "../utils/APIResponse";
import APIError from "../utils/APIError";
import User from "../models/user.models";
import { pagination } from "../utils/Pagination";

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
    const { content, author, title, tags, thumbnail } = req.body;

    if (!content || !author || !title || !tags || !thumbnail){
        throw new APIError(400, "Invalid data");
    }

    const article = await Article.create({
        content,
        author,
        title,
        tags: tags || [],
        thumbnail
    });

    if (!article){
        throw new APIError(400, "Error posting article");
    }

    res
        .status(201)
        .json(new APIResponse(201, article, "Posted article successfully"));
}); 

export const handleDeleteArticle = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.params;
    const id = req.user?._id as string;

    if (!articleId){
        throw new APIError(400, "articleId is required");
    }

    const article = await Article.findById(articleId).lean();

    if (!article){
        throw new APIError(404, "Article not found");
    }

    if (article.author.toString() !== id.toString()){
        throw new APIError(400, "Unauthorized request");
    }

    await Article.deleteOne({ _id: articleId });

    res
        .status(200)
        .json(new APIResponse(200, "", "Deleted article successfully"));
});

export const handleUpdateArticle = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.params;
    const { content, title, tags } = req.body;
    const id = req.user?._id as string;

    const updates: { [key: string]: any } = {};
    if (content !== undefined) updates.content = content;
    if (title !== undefined) updates.title = title;
    if (tags !== undefined && tags.length) updates.tags = tags;

    if (!articleId){
        throw new APIError(400, "articleId is required");
    }

    const article = await Article.findById(articleId);

    if (!article) throw new APIError(404, "Article not found");

    if (article.author.toString() !== id.toString()) {
        throw new APIError(403, "Unauthorized to update this article");
    }

    const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        { $set: updates },
        { new: true, runValidators: true }
    ).lean();

    if (!updatedArticle){
        throw new APIError(400, "Article not found or unauthorized");
    }

    res
        .status(200)
        .json(new APIResponse(200, updatedArticle, "Successfully updated article"));
});     