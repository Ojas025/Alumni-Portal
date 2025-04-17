import { model, Types, Document, Schema } from 'mongoose'

interface Note extends Document {
    content: string;
    author: Types.ObjectId;
};

const NoteSchema = new Schema({
    content: { type: String, required: true, default: "" },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true } );

const Note = model<Note>("Note", NoteSchema);
export default Note;