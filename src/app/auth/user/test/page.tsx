"use client";

import { useState } from "react";
import axios from "axios";

export default function StartRegistrationPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      setLoading(true);

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      await axios.post("auth/start-registration", {
        email,
        username,
        password,
        timezone,  // 👉 Send it automatically
      });

      setMessage("OTP sent to your email!");
    } catch (error: any) {
      setMessage(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h1 className="text-xl mb-4">Register</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
