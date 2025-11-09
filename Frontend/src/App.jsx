import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar"; // ✅ Import Navbar

export default function App() {
  return (
    <>
      {/* ✅ Common Navbar (always visible) */}
      <NavBar />

      {/* Page content */}
      <div className="pt-20 min-h-screen w-full flex flex-col bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-500 text-white">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Feed />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/post"
            element={
              <ProtectedRoute>
                <Post />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}
