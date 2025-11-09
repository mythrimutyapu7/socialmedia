const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ✅ Register
export async function register(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

// ✅ Login
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

// ✅ Create Post — FIXED (accepts FormData directly)
export async function createPost(formData) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData, // 👈 no Content-Type
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ Error creating post:", err);
    return { msg: "Server error" };
  }
}


// ✅ Get all posts
export async function getPosts() {
  try {
    const res = await fetch(`${API_BASE}/posts`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ getPosts error:", err);
    return [];
  }
}

// ✅ Delete post
export async function deletePost(id) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return res.json();
}

// ✅ Like / Unlike
export async function toggleLike(id) {
  const res = await fetch(`${API_BASE}/posts/like/${id}`, {
    method: "PUT",
    headers: { ...authHeader() },
  });
  return res.json();
}

// ✅ Add comment
export async function addComment(id, text) {
  const res = await fetch(`${API_BASE}/posts/comment/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

// ✅ Edit post
export async function editPost(id, text) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ text }),
  });

  return res.json();
}


// ✅ Get posts by logged-in user
export async function getUserPosts(userId) {
  const res = await fetch(`${API_BASE}/posts/user/${userId}`, {
    headers: { ...authHeader() },
  });
  return res.json();
}
