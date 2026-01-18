import React, { useState } from "react";
import axios from "axios";
import Register from "./Register";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });

      // Access & Refresh token
      const { access, refresh } = res.data;

      // Save tokens in localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      setMessage("Login successful!");
      if (onLogin) onLogin(); // callback to parent
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setMessage(err.response?.data?.error || "Invalid credentials");
    }
  };

  if (showRegister) {
    return (
      <div>
        <Register onRegisterSuccess={() => setShowRegister(false)} />
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button 
            onClick={() => setShowRegister(false)}
            style={{ padding: 10, cursor: "pointer" }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 300, margin: "0 auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 15 }}>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button 
          type="submit"
          style={{ padding: 10, width: "100%", cursor: "pointer" }}
        >
          Login
        </button>
      </form>
      {message && (
        <p style={{ marginTop: 15, color: message.includes("successful") ? "green" : "red" }}>
          {message}
        </p>
      )}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <p>Don't have an account?</p>
        <button 
          onClick={() => setShowRegister(true)}
          style={{ padding: 10, cursor: "pointer", background: "#007bff", color: "white", border: "none" }}
        >
          Register Here
        </button>
      </div>
    </div>
  );
};

export default Login;
