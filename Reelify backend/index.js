import express from "express"
import {ImageToVideo} from "./routes/ImageToVideo.js"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());


app.use("/",ImageToVideo);

app.listen(3000);