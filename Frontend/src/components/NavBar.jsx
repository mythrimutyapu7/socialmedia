import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import "../styles/NavBar.css";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const name = localStorage.getItem("name") || "Guest";
  const firstLetter = name[0]?.toUpperCase() || "U";

  const handleLogout = () => {
    localStorage.clear();
    nav("/login");
  };

  const handleNavClick = (path) => {
    if (!loggedIn && (path === "/post" || path === "/profile")) {
      nav("/login");
    } else {
      nav(path);
    }
  };

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-logo" onClick={() => handleNavClick("/feed")}>
        AppDost
      </div>

      {/* Middle: Links */}
      <div className="navbar-links">
        <button
          onClick={() => handleNavClick("/feed")}
          className={`nav-btn ${
            location.pathname === "/feed" ? "active" : ""
          }`}
        >
          Feed
        </button>
        <button
          onClick={() => handleNavClick("/post")}
          className={`nav-btn ${
            location.pathname === "/post" ? "active" : ""
          }`}
        >
          Create
        </button>
        <button
          onClick={() => handleNavClick("/profile")}
          className={`nav-btn ${
            location.pathname === "/profile" ? "active" : ""
          }`}
        >
          Profile
        </button>
      </div>

      {/* Right: Auth Buttons / Avatar */}
      <div className="navbar-right">
        {!loggedIn ? (
          <>
            <button onClick={() => nav("/login")} className="auth-btn">
              Login
            </button>
            <button onClick={() => nav("/signup")} className="auth-btn">
              Signup
            </button>
          </>
        ) : (
          <>
            <div
              className="avatar"
              onClick={() => handleNavClick("/profile")}
              title="Go to Profile"
            >
              {firstLetter}
            </div>
            <button onClick={handleLogout} className="auth-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
