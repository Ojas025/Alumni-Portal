import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import APIError from "../utils/APIError";
import Note from "../models/note.models";
import APIResponse from "../utils/APIResponse";

export const handlePostNote = asyncHandler(async (req: Request, res: Response) => {
    const { content } = req.body;

    if (!content) throw new APIError(400, "Feedback cannot be empty");

    const note = await Note.create({
        content,
        author: req.user?._id 
    });

    if (!note) throw new APIError(400, "Error posting feedback");

    res
        .status(201)
        .json(new APIResponse(201, note, "Note posted successfully"));
});

export const handleFetchAllNotes = asyncHandler(async (req: Request, res: Response) => {
    
    const notes = await Note.find({});

    res
        .status(200)
        .json(new APIResponse(201, notes, "Note posted successfully"));
});

export const handleDeleteNote = asyncHandler(async (req: Request, res: Response) => {
    const { noteId } = req.params;

    if (!noteId) throw new APIError(400, "noteId is required");

    const note = await Note.findByIdAndDelete(noteId);

    if (!note) throw new APIError(400, "Note not found");

    res
        .status(200)
        .json(new APIResponse(200, note, "Note deleted successfully"));
});