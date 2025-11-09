import React, { useState } from "react";
import { createPost } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../styles/Post.css";

export default function Post() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const nav = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
  e.preventDefault();
  if (!text.trim()) {
    toast.error("Please write something before posting ❌");
    return;
  }

  const formData = new FormData();
  formData.append("text", text);
  if (image) formData.append("image", image);

  const res = await createPost(formData);
  console.log("📸 New post response:", res); // ✅ Add this for debugging

  if (res._id) {
    toast.success("Post created successfully 🎉");
    setText("");
    setImage(null);
    setPreview(null);
    nav("/feed");
  } else {
    toast.error("Error creating post ❌");
  }
};


  return (
    <div className="post-container">
      <div className="glass-card create-card">
        <h2 className="post-title">Create a Post ✨</h2>
        <p className="post-subtitle">
          Share your thoughts and inspire others 🌍
        </p>

        <form onSubmit={submit} className="post-form">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="post-textarea"
            rows={3}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="post-file"
          />

          {preview && (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-img" />
            </div>
          )}

          <div className="button-row">
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setImage(null);
                }}
                className="remove-btn"
              >
                Remove
              </button>
            )}
            <button type="submit" className="post-btn">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
