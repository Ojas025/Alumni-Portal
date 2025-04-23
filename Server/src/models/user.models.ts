import { Schema, Document, model, Types } from 'mongoose'
import { USER_ROLES } from '../utils/constants';
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { USER_TEMPORARY_TOKEN_EXPIRY } from '../utils/constants';

export interface IUser extends Document {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    dob: Date;
    profileImageURL: string;
    role: USER_ROLES;
    batch: Date;
    interests: string[];
    skills: string[];
    bio: string;
    refreshToken: string;
    jobDetails: {
        company: string,
        title: string,
    };
    location: string;
    linkedin: string;
    github: string;
    availableForMentorship: boolean;
    connections: Types.ObjectId[];
    currentMentor: Types.ObjectId;
    currentMentee: Types.ObjectId;
    projects: [{
        title: string,
        url: string,
        description: string,
        technologiesUsed: string[]
    }];
    languages: string[];
    department: string;
    coordinates: number[];
    passwordHashed: boolean;
    college: Types.ObjectId;

    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
    generateTemporaryToken(): { unhashedToken: string, hashedToken: string, tokenExpiry: number }
};

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    password: { type: String, required: true },
    passwordHashed: { type: Boolean, default: false },
    dob: { type: Date },
    profileImageURL: { type: String, default: "" },
    role: { type: String, enum: Object.values(USER_ROLES), required: true },
    batch: { type: Date, required: true },
    skills: [{ type: String }],
    interests: [{ type: String }],
    bio: { type: String },
    department: { type: String },
    refreshToken: { type: String },
    jobDetails: {
        company: { type: String, default: "" },
        title: { type: String, default: "" }
    },
    location: { type: String, default: "" },
    linkedin: { type: String, required: true,  match: /^https:\/\/(www\.)?linkedin\.com\/.+$/ },
    github: { type: String, required: true, match: /^https:\/\/(www\.)?github\.com\/.+$/ },
    availableForMentorship: { type: Boolean, default: false },
    connections: [{ type: Schema.Types.ObjectId, ref: "User" }],
    college: { type: Schema.Types.ObjectId, ref: "College" },
    coordinates: [{ type: Number }],
    projects: [{
        title: { type: String, required: true },
        url: { type: String, required: true },
        description: { type: String, required: true },
        technologiesUsed: [{ type: String }]
    }],
    languages: [{ type: String }],
}, { timestamps: true });

UserSchema.pre("save", async function(next) {
    if (!this.isModified("password") || this.passwordHashed) return next();
    
    try {
        this.password = await bcrypt.hash(this.password, 10);
        this.passwordHashed = true;
        return next();
    }
    catch(error) {
        return next(error as Error);
    }
});

UserSchema.methods.isPasswordCorrect = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateAccessToken = function () {

    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const tokenExpiry = Number(process.env.ACCESS_TOKEN_EXPIRY);

    if (!secretKey){
        throw new Error("Could not find ACCESS_TOKEN_SECRET");
    }
    
    if (!tokenExpiry){
        throw new Error("Could not find ACCESS_TOKEN_EXPIRY");
    }

    const payload = {
        _id: this._id,
        role: this.role,
    }

    return jwt.sign(payload, secretKey, { expiresIn: tokenExpiry });
}


UserSchema.methods.generateRefreshToken = function () {

    const secretKey = process.env.REFRESH_TOKEN_SECRET;
    const expiry = Number(process.env.REFRESH_TOKEN_EXPIRY);


    if (!expiry){
        throw new Error("Could not find REFRESH_TOKEN_EXPIRY");
    }

    if (!secretKey){
        throw new Error("Could not find REFRESH_TOKEN_SECRET");
    }

    const payload = {
        _id: this._id.toString(),
    };

    return jwt.sign(payload, secretKey, { expiresIn: expiry });
};

UserSchema.methods.generateTemporaryToken = function () {
    // This token should be sent to the client
    const unHashedToken = crypto.randomBytes(20).toString("hex");
  
    // This should stay in the DB to compare at the time of verification
    const hashedToken = crypto
      .createHash("sha256")
      .update(unHashedToken)
      .digest("hex");
    // This is the expiry time for the token (20 minutes)
    const tokenExpiry = Date.now() + USER_TEMPORARY_TOKEN_EXPIRY;
  
    return { unHashedToken, hashedToken, tokenExpiry };
};

const User = model<IUser>("User", UserSchema);
export default User;