const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const Post = require("../models/Post");

// 🖼 Multer setup (for local uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "");
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

/* -------------------- 📤 CREATE POST -------------------- */
// Create a new post (with optional image)
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    // ✅ Create and save the post
    const newPost = new Post({
      user: req.user.id,
      text: req.body.text,
      image: req.file ? req.file.filename : null,
    });

    const savedPost = await newPost.save();

    // ✅ Populate full user info for frontend
    const populatedPost = await Post.findById(savedPost._id)
      .populate("user", "name email")
      .lean();

    // ✅ Return clean consistent data
    res.status(201).json({
      ...populatedPost,
      image: populatedPost.image || null,
      likes: populatedPost.likes || [],
      comments: populatedPost.comments || [],
    });
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});


/* -------------------- 🌍 GET ALL POSTS (Public) -------------------- */
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 })
      .lean();

    const cleanPosts = posts.map((p) => ({
      ...p,
      user: p.user || { name: "Unknown User" },
      image: p.image || null,
      likes: Array.isArray(p.likes) ? p.likes : [],
      comments: Array.isArray(p.comments) ? p.comments : [],
    }));

    res.json(cleanPosts);
  } catch (err) {
    console.error("🔥 Error fetching posts:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/* -------------------- 🗑 DELETE POST -------------------- */
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Forbidden: not the owner" });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: "Post deleted" });
  } catch (err) {
    console.error("Delete Post Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* -------------------- ❤️ LIKE / UNLIKE POST -------------------- */
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const liked = post.likes.includes(req.user.id);

    if (liked) {
      post.likes = post.likes.filter((uid) => uid.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    const updated = await Post.findById(post._id)
      .populate("user", "name")
      .populate("comments.user", "name");
    res.json(updated);
  } catch (err) {
    console.error("Like route error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* -------------------- 💬 ADD COMMENT -------------------- */
router.post("/comment/:id", auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.comments.push({ user: req.user.id, text });
    await post.save();

    const updated = await Post.findById(post._id)
      .populate("user", "name")
      .populate("comments.user", "name");

    res.json(updated);
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* -------------------- ✏️ EDIT POST -------------------- */
// ✏️ Edit post (only owner)
router.put("/:id", auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ msg: "Text is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    // ✅ Only the owner can edit
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    post.text = text;
    await post.save();

    // ✅ Re-fetch with populated user for frontend
    const updatedPost = await Post.findById(post._id)
      .populate("user", "name email")
      .populate("comments.user", "name");

    res.json(updatedPost);
  } catch (err) {
    console.error("❌ Edit post error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/* -------------------- 👤 USER'S POSTS (Profile) -------------------- */
router.get("/user/:userId", auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("User Posts Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
