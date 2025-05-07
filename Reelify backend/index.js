import express from "express"
import {ImageToVideo} from "./routes/ImageToVideo.js"
import cors from "cors"
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({origin:"https://reelify-ai-1.onrender.com"}));
const PORT = process.env.PORT || 5000;

export const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("successfully connected");
    } catch (err) {
      console.error("Connection error:", err.message);
      process.exit(1); 
    }
  };
connectDB();
app.use("/",ImageToVideo);

app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});