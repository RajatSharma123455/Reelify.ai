import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/ImageToVideoConverter.css";
import placeholder from "../assets/placeholder.jpg";

const ImageToVideoApp = () => {
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [promptText, setPromptText] = useState("");
  const [videoURL, setVideoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoLoader, setVideoLoader] = useState(false);
  const [time, setTime] = useState("5");
  const [ratio, setRatio] = useState("16:9");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleConvert = async () => {
    if (!imageFile) return;
    setLoading(true);
    setVideoLoader(true);
    setVideoURL("");

    try {
      const base64Image = await convertToBase64(imageFile);

      const postRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/image-to-video`,
        {
          image_url: base64Image,
          prompt: promptText,
          duration: time,
          ratio: ratio,
        }
      );

      const generation_id = postRes.data.id;

      const interval = setInterval(async () => {
        try {
          const getRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/download-video?id=${generation_id}`
          );

          const { video, status } = getRes.data;
          if (video && status === "completed") {
            setVideoURL(video[0]);
            toast.success("Video generated successfully!");
            setVideoLoader(false);
            setLoading(false);
            clearInterval(interval);
          } else if (status === "error") {
            toast.error("Please try again!");
            setLoading(false);
            setVideoLoader(false);
            clearInterval(interval);
          }
        } catch (error) {
          toast.error(error.message);
          setLoading(false);
          setVideoLoader(false);
          clearInterval(interval);
        }
      }, 5000);
    } catch (error) {
      console.log(error);
      if (error.status === 500) {
        toast.error(error.response.data.error);
      }
      setLoading(false);
      setVideoLoader(false);
    }
  };
  console.log("prompt===>", promptText, "time--<", time, "ratio", ratio);
  return (
    <div className="app-wrapper">
      <aside className="sidebar">
        <h1 className="brand">REELIFY</h1>

        <div className="upload-section">
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label htmlFor="fileInput" className="upload-btn">
            Choose Image
          </label>
          <p>Select an image to convert into video</p>
        </div>

        <div className="preview-box">
          {previewURL ? (
            <img
              src={previewURL}
              alt="imagePreview"
              className="preview-image"
            />
          ) : (
            <img
              src={placeholder}
              alt="placeholder"
              className="empty-preview"
            />
          )}
        </div>
        <div className="prompt-container">
          <textarea
            className="prompt-text"
            name={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            type="text"
            placeholder="Enter the prompt to generate the video from image"
          />
        </div>
        <div className="dropdown-container">
          <div>
          <label for="time">Time:</label>
          <select
            id="time"
            name="time"
            className="select"
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="5">5 seconds</option>
            <option value="10">10 seconds</option>
          </select>
          </div>

          <div>
          <label for="ratio">Aspect Ratio:</label>
          <select
            id="ratio"
            name="ratio"
            className="select"
            onChange={(e) => setRatio(e.target.value)}
          >
            <option value="16:9">16:9</option>
            <option value="9:16">9:16</option>
            <option value="4:3">4:3</option>
            <option value="3:4">3:4</option>
            <option value="1:1">1:1</option>
            <option value="21:9">21:9</option>
          </select>
          </div>
        </div>

        <button
          className="convert-btn"
          onClick={handleConvert}
          disabled={!imageFile || loading}
        >
          {loading ? "Generating..." : "Convert to Video"}
        </button>
      </aside>

      <main className="video-output">
        {!videoLoader ? (
          videoURL ? (
            <div className="video-wrapper">
              <h2 className="video-title">Your Generated video is Ready!</h2>
              <video controls>
                <source src={videoURL} type="video/mp4" />
              </video>
            </div>
          ) : (
            <div className="default-video-layout">
              <p>Please upload an image to start generating your video.</p>
            </div>
          )
        ) : (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Generating video, please wait...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ImageToVideoApp;
