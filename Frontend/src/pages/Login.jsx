import React, { useState } from "react";
import { login } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/Login.css"; // 👈 we'll create this file for styling

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("name", res.user.name);
      localStorage.setItem("email", res.user.email);
      localStorage.setItem("joined", res.user.createdAt);

      toast.success("Welcome back, " + res.user.name + " 👋");
      nav("/feed");
    } else {
      setErr(res.msg || "Invalid credentials");
      toast.error("Invalid login. Please try again ❌");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome back 👋</h2>
        <p className="login-subtitle">Please enter your details</p>

        {err && <p className="login-error">{err}</p>}

        <form onSubmit={submit} className="login-form">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="login-options">
            <label className="remember">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <button type="button" className="google-btn">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
            />
            Sign in with Google
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
