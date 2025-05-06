import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const ImageToVideo = express.Router();
const API_KEY = process.env.API_KEYS;

ImageToVideo.post("/image-to-video", async (req, res) => {
  const {
    img_prompt,
    model = "gen4",
    image_as_end_frame = false,
    flip = false,
    motion = 5,
    seed = 0,
    callback_url = "",
    time = 5
  } = req.body;


  if (!img_prompt) {
    return res.status(400).json({ error: "Missing imageUrl" });
  }
  
  try {

    const response = await axios.post(
      "https://api.aivideoapi.com/runway/generate/image",
      {
        img_prompt,
        model,
        image_as_end_frame,
        flip,
        motion,
        seed,
        callback_url,
        time
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        }
      }
    );
 

    res.json(response.data);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Your free trial exhausted." });
  }
});

ImageToVideo.get("/download-video", async (req, res) => {
  const { uuid } = req.query;
  

  if (!uuid) {
    return res.status(400).json({ error: "UUID is required to check status" });
  }
  try {
    const response = await axios.get(
      `https://api.aivideoapi.com/status/?uuid=${uuid}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          
        },
      }
    );

    res.json(response.data);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Status check failed" });
  }
});