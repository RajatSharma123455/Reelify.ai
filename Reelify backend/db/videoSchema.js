import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
 
  image_url: { type: String, required: true },
  gen_id: { type: String },
  video_url: { type: [String] },
  createdAt: { type: Date, default: Date.now },
});

export const Video= mongoose.model("Video", videoSchema);
