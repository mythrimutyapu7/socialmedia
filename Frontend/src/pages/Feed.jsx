import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Edit2, Trash2 } from "lucide-react";
import "../styles/Feed.css";
import {
  getPosts,
  deletePost,
  toggleLike,
  addComment,
  editPost,
} from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import toast from "react-hot-toast";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState("");
  const name = localStorage.getItem("name") || "Guest";
  const userId = localStorage.getItem("userId");
  const nav = useNavigate();
  const location = useLocation();
  const loggedIn = isLoggedIn();

  const load = async () => {
    try {
      const p = await getPosts();
      setPosts(Array.isArray(p) ? p : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts");
    }
  };

  useEffect(() => {
    load();
  }, [location.pathname]);

  const handleDelete = async (id) => {
    if (!loggedIn) return nav("/login");
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p._id !== id));
    toast.success("Post deleted 🗑️");
  };

  const handleLike = async (id) => {
    if (!loggedIn) return nav("/login");
    const updated = await toggleLike(id);
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  const toggleComments = (id) => {
    setExpandedPostId((prev) => (prev === id ? null : id));
    setNewComment("");
  };

  const submitComment = async (id) => {
    if (!newComment.trim()) return toast.error("Please enter a comment");
    const updated = await addComment(id, newComment);
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    setNewComment("");
    toast.success("Comment added 💬");
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setEditText(post.text);
  };

  const saveEdit = async () => {
    if (!editText.trim()) return toast.error("Post text cannot be empty ❌");
    try {
      const updated = await editPost(editingPost._id, editText);
      if (updated && updated._id) {
        setPosts((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );
        toast.success("Post updated ✨");
      } else {
        toast.error("Failed to update post ❌");
      }
      setEditingPost(null);
      setEditText("");
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error("Something went wrong 😢");
    }
  };

  // ✅ check if liked by this user
  const isLiked = (post) => post.likes?.includes(userId);

  return (
    <div className="feed-page">
      <div className="feed-wrapper">
        <h2 className="feed-title">Everyone’s Posts 🌍</h2>

        {posts.length === 0 && <p className="no-posts-text">No posts yet 😇</p>}

        {posts.map((p) => (
          <div key={p._id} className="feed-card">
            {/* Header */}
            <div className="feed-header">
              <div className="feed-user-info">
                <div className="feed-avatar">
                  {p.user?.name ? p.user.name[0].toUpperCase() : "?"}
                </div>
                <div>
                  <h3 className="feed-username">
                    {p.user?.name || "Anonymous"}
                  </h3>
                  <p className="feed-date">
                    {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {loggedIn && p.user?.name === name && (
                <div className="feed-actions">
                  <button
                    onClick={() => openEditModal(p)}
                    className="feed-edit-btn"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="feed-delete-btn"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Image */}
            {p.image && (
              <div className="feed-image-container">
                <img
                  src={`http://localhost:5001/uploads/${p.image}`}
                  alt="Post"
                  className="feed-image"
                />
              </div>
            )}

            {/* Caption */}
            <p className="feed-text">{p.text}</p>

            {/* Footer */}
            <div className="feed-footer">
              <button
                onClick={() => handleLike(p._id)}
                className={`feed-icon-btn heart-btn ${isLiked(p) ? "liked" : ""}`}
              >
                <Heart
                  size={22}
                  strokeWidth={2}
                  className={`heart-icon ${isLiked(p) ? "liked" : ""}`}
                />
                <span>{p.likes?.length || 0}</span>
              </button>

              <button
                onClick={() => toggleComments(p._id)}
                className="feed-icon-btn"
              >
                <MessageCircle size={22} strokeWidth={2} className="icon" />
                <span>{p.comments?.length || 0}</span>
              </button>
            </div>

            {/* Comments Section */}
            {expandedPostId === p._id && (
              <div className="feed-comments">
                {p.comments?.length > 0 ? (
                  p.comments.map((c, idx) => (
                    <div key={idx} className="comment-item">
                      <span className="comment-user">
                        {c.user?.name || "User"}:
                      </span>{" "}
                      {c.text}
                    </div>
                  ))
                ) : (
                  <p className="no-comments">No comments yet 😇</p>
                )}

                <div className="add-comment">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button onClick={() => submitComment(p._id)}>Post</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="edit-overlay">
          <div className="edit-modal">
            <h3>Edit Post</h3>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
            />
            <div className="edit-actions">
              <button onClick={() => setEditingPost(null)}>Cancel</button>
              <button onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
