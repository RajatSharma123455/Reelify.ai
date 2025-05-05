import React, { useState } from "react";
import "../styles/ImageToVideoConverter.css";
import placeholder from "../assets/placeholder.jpg";
import { MdOutlineFileUpload } from "react-icons/md";

export default function ImageToVideoConverter() {
  const [uploadImage, setUploadImage] = useState(null);

  function HandleUploadImage(e) {
    const uploadFile = e.target.files[0];

    if (uploadFile) {
      const imageUrl = URL.createObjectURL(uploadFile);
      setUploadImage(imageUrl);
    }
  }

  return (
    <section className="container">
      <h1 className="heading-main">REELIFY</h1>
      <div className="image-box">
        <input
          type="file"
          accept="image/*"
          id="uploadfile"
          name="select-file"
          onChange={HandleUploadImage}
          className="hide-input"
          style={{display:"none"}}
        />
         <label
        htmlFor="uploadfile"
        className="customize-input"
      >
        Choose Image <MdOutlineFileUpload className="upload-icon"/>
      </label>
        <span>Select an image to convert into video</span>
        <div className="image-preview">
          <img
            src={uploadImage ? uploadImage : placeholder}
            alt="Upload-image"
            className="uploaded-image"
          />
        </div>
        {/* <input></input> */}
    <div className="edit-and-download-buttons">
        <button className="button1">Convert To Video</button>
        <button className="button1" onClick={() => setUploadImage(null)}>Change Image</button>
        </div>
      </div>
    </section>
  );
}
