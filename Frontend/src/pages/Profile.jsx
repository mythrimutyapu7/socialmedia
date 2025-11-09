import React, { useEffect, useState } from "react";
import { getPosts, deletePost } from "../services/api";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import toast from "react-hot-toast";
import "../styles/Profile.css";

export default function Profile() {
  const [myPosts, setMyPosts] = useState([]);
  const name = localStorage.getItem("name") || "Guest";
  const email = localStorage.getItem("email");
  const joined = localStorage.getItem("joined");
  const nav = useNavigate();
  const loggedIn = isLoggedIn();

  // 🧠 Fetch posts for this user
  const loadMyPosts = async () => {
    const posts = await getPosts();
    const mine = posts.filter((p) => p.user?.name === name);
    setMyPosts(mine);
  };

  useEffect(() => {
    if (!loggedIn) {
      toast.error("Please login to view your profile 🔐");
      return nav("/login");
    }
    loadMyPosts();
  }, []);

  // 🗑️ Delete post
  const handleDelete = async (id) => {
    await deletePost(id);
    await loadMyPosts();
    toast.success("Post deleted 🗑️");
  };

  return (
    <div className="profile-page">
      {/* 🌸 Main content layout */}
      <div className="profile-content">
        {/* Left side - Profile Info */}
        <div className="profile-card">
          <div className="profile-avatar">{name[0]?.toUpperCase()}</div>
          <h2 className="profile-name">{name}</h2>
          <p className="profile-email">{email}</p>
          {joined && (
            <p className="profile-joined">
              Joined on {new Date(joined).toLocaleDateString()}
            </p>
          )}

          <div className="profile-stats">
            <div className="stat-box">
              <p>{myPosts.length}</p>
              <p>Posts</p>
            </div>
            <div className="stat-box">
              <p>{myPosts.reduce((acc, p) => acc + (p.likes?.length || 0), 0)}</p>
              <p>Likes</p>
            </div>
          </div>
        </div>

        {/* Right side - Posts */}
        <div className="my-posts">
          <h3>Your Posts ✨</h3>
          {myPosts.length === 0 && (
            <p className="no-posts">You haven’t posted anything yet 📝</p>
          )}

          {myPosts.map((p) => (
  <div key={p._id} className="post-card">
    <div className="flex justify-between items-center mb-2">
      <div>
        <h4 className="font-semibold text-gray-800">{p.user?.name}</h4>
        <p className="text-xs text-gray-500">
          {new Date(p.createdAt).toLocaleString()}
        </p>
      </div>
      <button
        onClick={() => handleDelete(p._id)}
        className="post-delete"
      >
        Delete
      </button>
    </div>

    {/* 🖼 image section - fixed ratio and styling */}
    {p.image && (
      <div className="profile-post-image-container">
        <img
          src={`http://localhost:5001/uploads/${p.image}`}
          alt="Post"
          className="profile-post-image"
        />
      </div>
    )}

    <p className="mt-3 text-gray-700 whitespace-pre-line">{p.text}</p>
  </div>
))}

        </div>
      </div>
    </div>
  );
}
