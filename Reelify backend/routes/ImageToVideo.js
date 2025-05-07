import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { Video } from "../db/videoSchema.js";

dotenv.config();

// POST request for initiating video generation via image, text propmt, duration etc.
export const ImageToVideo = express.Router();
const API_KEY = process.env.API_KEYS;

ImageToVideo.post("/image-to-video", async (req, res) => {
  const {
    model= "runway/gen4_turbo",
  prompt,
  image_url,
  duration,
  ratio,
  seed= 1
  } = req.body;


  if (!image_url) {
    return res.status(400).json({ error: "Please enter image and prompt." });
  }
  
  try {

    const response = await axios.post(
      "https://api.aimlapi.com/v2/generate/video/runway/generation",
      {
        model,
        prompt,
        image_url,
        duration,
        ratio,
        seed
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        }
      }
    );

    // Storing data in MongoDB after POST request hits
    if(response.data!=null){
      await Video.create({
        image_url,
        gen_id:response.data?.id,
      });
    }

    res.json(response.data);

  } catch (err) {
    const message = err.response?.data?.error || err.message || "Something went wrong.";
     res.status(400).json({ error: message });
  }

});

// API for getting status of queued video generation request
ImageToVideo.get("/download-video", async (req, res) => {
  const { id } = req.query;
  console.log("query",id)

  if (!id) {
    return res.status(400).json({ error: " Id is not generated" });
  }
  try {
    const response = await axios.get(
      `https://api.aimlapi.com/v2/generate/video/runway/generation?generation_id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          
        },
      }
    );
    const videoUrl = response.data?.video;

    // Storing video URL in MongoDB
    if (videoUrl) {
      await Video.findOneAndUpdate(
        { gen_id: id},
        { video_url: videoUrl[0] }
      );
    }
    res.json(response.data);

  } catch (err) {
    console.error(err.response?.data || err.message || "something went wrong");
    res.status(500).json({ error:message });
  }
});