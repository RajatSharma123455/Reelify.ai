import express from "express"
import {ImageToVideo} from "./routes/ImageToVideo.js"
import cors from "cors"
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({ origin: "https://reelify-ai-1.onrender.com"}));
const PORT = process.env.PORT || 5000;

app.use("/",ImageToVideo);

app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});