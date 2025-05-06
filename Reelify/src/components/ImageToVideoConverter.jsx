import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/ImageToVideoConverter.css";
import placeholder from "../assets/placeholder.jpg";

const ImageToVideoApp = () => {
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [videoURL, setVideoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoLoader, setVideoLoader] = useState(false);

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

      const postRes = await axios.post("http://localhost:3000/image-to-video", {
        img_prompt: base64Image,
      });

      const uuid = postRes.data.uuid;

      const interval = setInterval(async () => {
        try {
          const getRes = await axios.get(
            "http://localhost:3000/download-video",
            {
              params: { uuid },
            }
          );

          const { url, status } = getRes.data;
          if (url && status === "success") {
            setVideoURL(url);
            toast.success("Video generated successfully!");
            setVideoLoader(false);
            setLoading(false);
            clearInterval(interval);
          } else if (status === "failed") {
            toast.error(getRes.data.error);
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
      toast.error(error.message);
      setLoading(false);
      setVideoLoader(false);
    }
  };

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
          videoURL ?
          <div className="video-wrapper">
            <h2>Your Generated Video</h2>
            <video controls>
              <source src={videoURL} type="video/mp4" />
            </video>
          </div>
          :
          <div className="default-video-layout">
            <p>Please upload an image to start generating your video.
</p>
          </div>
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
