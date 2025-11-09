import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Connections() {
  const [users, setUsers] = useState([]);
  const userId = localStorage.getItem("id");
  const nav = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5001/api/connections/all/${userId}`)
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => toast.error("Failed to fetch users"));
  }, []);

  const sendRequest = async (id) => {
    const res = await fetch(`http://localhost:5001/api/connections/send/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId: userId })
    });
    const data = await res.json();
    toast.success(data.msg);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 text-white p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Connect with Others 🤝</h1>

      <div className="max-w-xl mx-auto space-y-4">
        {users.map((u) => (
          <div key={u._id} className="bg-white/10 backdrop-blur-md p-4 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{u.name}</h3>
              <p className="text-sm text-gray-300">{u.email}</p>
            </div>
            <button
              onClick={() => sendRequest(u._id)}
              className="bg-blue-500/80 hover:bg-blue-600/90 text-white px-3 py-1 rounded-lg transition"
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
