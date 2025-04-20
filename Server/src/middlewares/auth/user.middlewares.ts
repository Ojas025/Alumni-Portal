import "express"
import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/AsyncHandler";
import APIError from "../../utils/APIError";
import jwt from "jsonwebtoken"
import User from "../../models/user.models";
import APIResponse from "../../utils/APIResponse";

export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new APIError(401, "Unauthorized request");
    }


    try {

        if (!process.env.ACCESS_TOKEN_SECRET){
            throw new APIError(400, "ACCESS_TOKEN_SECRET not defined!");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        if (typeof decodedToken === "object" && decodedToken !== null) {
            const id = decodedToken._id;
            const user = await User.findOne({ _id: id }).select(
                "-password -refreshToken"
            );

            if (!user){
                throw new APIError(400, "Invalid Access Token");
            }

            req.user = user;
            next();
        }
    }
    catch (error) {
        console.log('Who tf are you?')
        throw new APIError(401, "Invalid Access Token");
    }
});

export const verifyPermission = (roles: string[] = []) => {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user?._id) {
            throw new APIError(401, "Unauthorized request");
        }

        if (roles.includes(req.user?.role)){
            next();
        }
        else{
            throw new APIError(403, "You are not allowed to perform this action");
        }
    });
}