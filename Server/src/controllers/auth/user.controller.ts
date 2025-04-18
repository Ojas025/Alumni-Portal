import { Request, Response } from "express";
import asyncHandler from "../../utils/AsyncHandler";
import User from "../../models/user.models";
import APIResponse from "../../utils/APIResponse";
import APIError from "../../utils/APIError";
import { generateAccessAndRefreshToken } from "../../utils/auth";
import jwt from "jsonwebtoken"
import { pagination } from "../../utils/Pagination";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../services/cloudinary";

export const handleUserLogin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Fetch user sent data
    // Search for user
    // If !user, return
    // Verify password
    // Create refresh and access tokens
    // Send them via secure cookies
    const user = await User.findOne({ email: email });

    if (!user){
        throw new APIError(404, "User not found!");
    }

    const isSamePassword = await user.isPasswordCorrect(password);

    if (!isSamePassword){
        throw new APIError(400, "Invalid password!");
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const options = {
        httpOnly: true,
        secure: true
    };

    const data = await User.findOne({ email: email }).select(
        "-password -refreshToken"
    ).populate("connections", "firstName lastName _id profileImageURL role"); 
    
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new APIResponse(200, { accessToken, refreshToken, user: data }, "User Logged In successfully!"))

});

export const handleUserSignUp = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, role, dob, batch, linkedin, github } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (existingUser){
        throw new APIError(400, "User already exists");
    }   

    const [ day, month, year ] = dob.split("/").map(Number);
    const DOB = new Date(year, month - 1, day);

    await User.create({
        firstName,
        lastName,
        email,
        password,
        role: role.toLowerCase(),
        dob: DOB,
        batch,
        linkedin,
        github
    });

    const user = await User.findOne({ email: email }).select(
        "-password -refreshToken"
    ).populate("connections", "firstName lastName _id profileImageURL role"); 

    if (!user){
        throw new APIError(400, "Error Signing Up");
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(user);


    const options = {
        httpOnly: true,
        secure: true
    };

    res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new APIResponse(201, { accessToken, refreshToken, user }, "User Signed Up successfully!"));
});

export const handleUserLogout = asyncHandler(async (req: Request, res: Response) => {

    // Search up the user, delete the stored refresh token
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new APIResponse(200, "User Logged out successfully"))
}); 

export const handleRefreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    // Fetch the client side refresh token
    // Compare with  the one stored in db
    // If not match, Unauthorized access
    // Else, generate new access, refresh tokens and return
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken){
        throw new APIError(401, "Invalid Refresh Token");
    }

    try {

        if (!process.env.REFRESH_TOKEN_SECRET) {
            throw new APIError(404, "REFRESH_TOKEN_SECRET not found");
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (typeof decodedToken !== "object" || decodedToken === null){
            throw new APIError(400, "Invalid Refresh Token");
        }

        const user = await User.findOne({ _id: decodedToken._id });

        if (incomingRefreshToken !== user?.refreshToken || !user){
            throw new APIError(401, "Invalid Refresh Token");
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        const { accessToken, refreshToken } = generateAccessAndRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new APIResponse(200, { accessToken, refreshToken }, "Refreshed Access Token"));
    }
    catch(error) {
        throw new APIError(401, "Invalid Refresh Token");
    }

});

export const handleUpdateUserPassword = asyncHandler(async (req: Request, res: Response) => {
    // Fetch new password from user
    // Compare the old and new passwords
    // If match, throw error
    // update user in db
    const  { newPassword } = req.body;
    
    if (!newPassword){
        throw new APIError(400, "New Password is required");
    }

    const user = await User.findById(req.user?._id);

    if (!user){
        throw new APIError(400, "User does not exist");
    }

    const isSamePassword = await user.isPasswordCorrect(newPassword);

    if (isSamePassword){
        throw new APIError(400, "Invalid Password");
    }
    
    user.password = newPassword;
    await user.save();

    res
        .status(200)
        .json(new APIResponse(200, null, "Password updated successfully"));
});

export const handleUpdateAccountDetails = asyncHandler(async (req: Request, res: Response) => {
    // Fetch new details from user
    // update user in db
    const userId = req.user?._id;

    if (!userId){
        throw new APIError(400, "Unauthorized request");
    }

    const {
        firstName,
        lastName,
        profileImageURL,
        skills,
        bio,
        jobDetails,
        batch,
        location,
        linkedin,
        github,
        availableForMentorship,
        projects,
        languages,
        department,
        coordinates
    } = req.body;

    const updates: { [key: string]: any } = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (profileImageURL !== undefined) updates.profileImageURL = profileImageURL;
    if (skills !== undefined) updates.skills = skills;
    if (bio !== undefined) updates.bio = bio;
    if (jobDetails !== undefined) {
        updates["jobDetails.company"] = jobDetails.company;
        updates["jobDetails.title"] = jobDetails.title;
    }
    if (location !== undefined) updates.location = location;
    if (batch !== undefined) updates.batch = batch;
    if (linkedin !== undefined) updates.linkedin = linkedin;
    if (github !== undefined) updates.github = github;
    if (projects !== undefined) updates.projects = projects;
    if (languages !== undefined) updates.languages = languages;
    if (department !== undefined) updates.department = department;
    if (availableForMentorship !== undefined) updates.availableForMentorship = availableForMentorship;
    if (coordinates !== undefined) updates.coordinates = coordinates;

    if (Object.keys(updates).length === 0) {
        throw new APIError(400, "No valid fields to update");
    }


    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser){
        throw new APIError(400, "Error while updating user profile");
    }


    res
        .status(200)
        .json(new APIResponse(200, updatedUser, "Successfully updated user profile"));
});

export const handleGetUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const id = req.user?._id;

    if (!id) {
        throw new APIError(400, "User id nto found");
    }
    
    const user = await User.findById(id).select(
        "-password -refreshToken"
    ).populate("connections", "firstName lastName _id profileImageURL role").lean(); 
    
    if (!user){
        throw new APIError(404, "User nto found");
    }

    res
        .status(200)
        .json(new APIResponse(200, user, "User profile retrieved successfully"));
});

export const handleFetchAllAlumniProfiles = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string).toLowerCase() || "";
        
    // Create a mongoDB filter
    const filter = { 
        role: "alumni",
        ...(search && {
            $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } }
            ]
        })
    };

    const total = await User.countDocuments(filter);
    const { startIndex, next, prev, totalPages } = pagination(page, limit, total);
    const alumnis = await User.find(filter).skip(startIndex).limit(limit).lean().select("-password -refreshToken");

    res
        .status(200)
        .json(new APIResponse(200, { alumnis, totalPages, totalResults: total, pagination: { prev, next } }, alumnis.length ? "Successfully fetched all alumni profiles" : "No alumnis found"));
});

export const handleFetchAllStudentProfiles = asyncHandler(async (req: Request, res: Response) => {
    const students = await User.find({ role: "student" }).lean();

    res
        .status(200)
        .json(new APIResponse(200, students || [], students.length ? "Successfully fetched all student profiles" : "No students found"));
});

export const handleDeleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?._id;

    if (userId?.toString() !== id.toString()){
        throw new APIError(400, "Unauthorized request");
    }

    if (!id) {
        throw new APIError(400, "Unauthorized request");
    }

    const user = await User.findById(id).lean();

    if (!user){
        throw new APIError(404, "User does not exist");
    }

    await User.deleteOne({ _id: id });

    res
        .status(200)
        .json(new APIResponse(200, "", "User deleted successfully"));
});

export const handleGetProfileById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id){
        throw new APIError(400, "Unauthorized request");
    }

    const user = await User.findById(id).select("-password -refreshToken").lean();

    if (!user){
        throw new APIError(404, "User not found");
    }

    res
        .status(200)
        .json(new APIResponse(200, user, "Fetched user details successfully"));
});

export const handleFetchAllConnections = asyncHandler(async (req: Request, res: Response) => {
    const id = req.user?._id;

    if (!id) {
        throw new APIError(403, "Unauthorized request");
    }

    const user = await User.findById(id).populate({ path: "connections", select: "firstName lastName _id profileImageURL role" }).lean();

    if (!user){
        throw new APIError(404, "User not found");
    }

    res
        .status(200)
        .json(new APIResponse(200, user?.connections, "Successfully fetched user connections"));
});

export const handleUpdateProfileImage = asyncHandler(async (req: Request & { file?: Express.Multer.File }, res: Response) => {
    const newProfileImageLocalPath = req.file?.path;
    const profileImageURL = req.user?.profileImageURL;
    const userId = req.user?._id; 

    if (!newProfileImageLocalPath){
        throw new APIError(404, "Image not found");
    }

    
    // Upload to cloudinary
    // The cloudinary public id is embedded in the url
    let publicId: string | undefined;
    
    if (profileImageURL){
        publicId = profileImageURL.split('/').pop()?.split('.')[0]
    }

    if (publicId){
        await deleteFileFromCloudinary(publicId);
    }
    
    // Upload the file to cloudinary with the same public id
    // The cache update may take some time
    const cloudinaryResponse = await uploadFileToCloudinary(newProfileImageLocalPath);

    if (!cloudinaryResponse) throw new APIError(400, "Error uploading file") 
        console.log(userId);

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: { profileImageURL: cloudinaryResponse.url }
        },
        { new: true, runValidators: true }
    )    
    
    if (!updatedUser) throw new APIError(400, 'Error updating profile')

    res
        .status(200)
        .json(new APIResponse(200, { profileImageURL: cloudinaryResponse?.url } , "Profile Image updated successfully! Update may take some time to display"));
});

export const handleAddConnection = asyncHandler(async (req: Request, res: Response) => {
    const { connecteeId } = req.params;
    const connectorId = req.user?._id;

    if (!connecteeId || !connectorId){
        throw new APIError(404, "connecteeId and connectorId is required");
    }

    const updatedUser = await User.findByIdAndUpdate(
        connectorId,
        {
            $addToSet: { connections: connecteeId },
        },
        { new: true, runValidators: true }
    ).populate("connections", "firstName lastName _id role profileImageURL").select("-password -refreshToken");

    res
        .status(200)
        .json(new APIResponse(200, updatedUser, "Successfully added connection"));
});

export const handleRemoveConnection = asyncHandler(async (req: Request, res: Response) => {
    const { connecteeId } = req.params;
    const connectorId = req.user?._id;

    if (!connecteeId || !connectorId){
        throw new APIError(404, "connecteeId and connectorId is required");
    }

    const updatedUser = await User.findByIdAndUpdate(
        connectorId,
        {
            $pull: { connections: connecteeId },
        },
        { new: true, runValidators: true }
    ).populate("connections", "firstName lastName _id role profileImageURL").select("-password -refreshToken");

    res
        .status(200)
        .json(new APIResponse(200, updatedUser, "Successfully removed connection"));
});

export const handleFetchUsers = asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.query;

    if (search === null || search === undefined) throw new APIError(400, "searchQuery is required");

    const filter = {
        $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
        ]
    };

    const users = await User.find(filter).lean().select("firstName lastName profileImageURL _id role");

    res
        .status(200)
        .json(new APIResponse(200, users, "Successfully fetched users"));
});

export const handleGetAlumniLocations = asyncHandler(async (req: Request, res: Response) => {
    const alumnis = await User.find({ role: 'alumni' }).select("firstName lastName coordinates profileImageURL _id location").lean();     

    res
        .status(200)
        .json(new APIResponse(200, alumnis, "Alumni locations fetched successfully"));
});



//  {}