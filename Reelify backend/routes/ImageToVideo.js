import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
export const ImageToVideo = express.Router();
const API_KEY = process.env.API_KEYS;

ImageToVideo.post("/image-to-video", async (req, res) => {
  const {
    prompt,
    image_url,
    last_image_url,
    duration = 5,
    ratio = "16:9",
    seed = 1,
    watermark = true,
  } = req.body;
  

  try {
    const response = await axios.post(
      "https://api.aimlapi.com/v2/generate/video/runway/generation",
      {
        model: "gen3a_turbo",
        prompt,
        image_url,
        last_image_url,
        duration,
        ratio,
        seed,
        watermark,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error?.response?.data || error?.message);
    res.status(500).json("Not able to convert image to video");
  }
});

ImageToVideo.get("/download-video", async (req, res) => {
  const {generated_ID} = req.query;
console.log(req.query.id);
  try {
    const response = await axios.get(
      `https://api.aimlapi.com/v2/generate/video/runway/generation?generation_id=${generated_ID}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        // params: {
        //   generation_id: generated_ID,
        // },
      }
    );
    res.status(200).json({message: "Video generated successfully",data:response.data});
  } catch (error) {
    console.error(error?.response?.data || error?.message);
    res.status(500).json("failed to generate the video");
  }
});
