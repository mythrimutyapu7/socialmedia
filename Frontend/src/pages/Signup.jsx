import React, { useState } from "react";
import { register } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/Login.css"; 

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password);
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("name", res.user.name);
      localStorage.setItem("email", res.user.email);
      localStorage.setItem("joined", res.user.createdAt);

      toast.success("Account created successfully 🎉");
      nav("/feed");
    } else {
      setErr(res.msg || "Error creating account");
      toast.error("Signup failed. Try again ❌");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Create your account ✨</h2>
        <p className="login-subtitle">Join AppDost and get started</p>

        {err && <p className="login-error">{err}</p>}

        <form onSubmit={submit} className="login-form">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            Sign Up
          </button>

          <button type="button" className="google-btn">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
            />
            Sign up with Google
          </button>
        </form>

        <p className="login-footer">
          Already have an account?{" "}
          <Link to="/login" className="signup-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
