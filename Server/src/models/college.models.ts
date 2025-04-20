import { Schema, Document, model, Types } from 'mongoose'

export interface ICollege extends Document {
    name: string;
    emailDomain: string;
    address: string;
    logo: string;
};

const CollegeSchema = new Schema<ICollege>({
    name: { type: String, required: true },
    emailDomain: { type: String, unique: true, sparse: true },
    address: { type: String },
    logo: { type: String },
}, { timestamps: true });

const College = model<ICollege>("College", CollegeSchema);
export default College