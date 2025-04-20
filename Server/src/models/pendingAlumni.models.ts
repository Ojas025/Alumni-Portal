import { Schema, Document, model, Types } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IPendingAlumni extends Document {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    dob: Date;
    batch: Date;
    linkedin: string;
    github: string;
    document: string;
    college: Types.ObjectId;
};

const pendingAlumniSchema = new Schema<IPendingAlumni>({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    password: { type: String, required: true },
    dob: { type: Date },
    batch: { type: Date, required: true },
    linkedin: { type: String, required: true,  match: /^https:\/\/(www\.)?linkedin\.com\/.+$/ },
    github: { type: String, required: true, match: /^https:\/\/(www\.)?github\.com\/.+$/ },
    document: { type: String, required: true },
    college: { type: Schema.Types.ObjectId, ref: 'College', required: true },
}, { timestamps: true });

pendingAlumniSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    
    try {
        this.password = await bcrypt.hash(this.password, 10);
        return next();
    }
    catch(error) {
        return next(error as Error);
    }
});

const PendingAlumni = model<IPendingAlumni>("PendingAlumni", pendingAlumniSchema);
export default PendingAlumni;