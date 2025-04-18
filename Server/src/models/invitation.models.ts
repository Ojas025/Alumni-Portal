import { Schema, Document, model, Types } from 'mongoose'

export interface IInvitation extends Document {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    status: "pending" | "accepted" | "rejected";
    type: "mentoring" | "connection"
};

const InvitationSchmea = new Schema<IInvitation>({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    type: { type: String, enum: ["mentoring", "connection"], required: true }
}, { timestamps: true });

const Invitation = model<IInvitation>("Invitation", InvitationSchmea);
export default Invitation;