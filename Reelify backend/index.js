import express from "express"
import {ImageToVideo} from "./routes/ImageToVideo.js"
import cors from "cors"

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());


app.use("/",ImageToVideo);

app.listen(3000);