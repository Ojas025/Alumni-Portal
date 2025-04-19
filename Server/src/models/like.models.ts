import { Schema, Document, Types, model } from 'mongoose'

interface Like extends Document {
    user: Types.ObjectId;
    post: Types.ObjectId;
    postType: "Article" | "GalleryPost" | "Tweet"
}

const LikeSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, refPath: 'postType', required: true },
    postType: { type: String, enum: ["article", "gallery", "forum"] }
}, { timestamps: true });

const Like = model<Like>("Like", LikeSchema);
export default Like;