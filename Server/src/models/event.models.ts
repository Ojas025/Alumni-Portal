import { Document, model, Types, Schema } from 'mongoose'

interface Event extends Document {
    title: string;
    location: string;
    date: Date;
    time: string;
    owner: Types.ObjectId;
    rsvps: Types.ObjectId[];
    description: string;
    entryFee: number;
    image: string;
}

const EventSchema = new Schema<Event>({
    title: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rsvps: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    description: { type: String, default: "" },
    entryFee: { type: Number, default: 0 },
    image: { type: String },
}, { timestamps: true });

const Event = model<Event>("Event", EventSchema);
export default Event;