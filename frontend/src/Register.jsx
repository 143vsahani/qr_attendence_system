import React, { useState } from "react";
import axios from "axios";

const Register = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/register/", {
        username,
        password,
        role,
      });

      setMessage("✓ Registration successful! You can now login.");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      
      if (onRegisterSuccess) {
        setTimeout(onRegisterSuccess, 2000);
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      setMessage(err.response?.data?.error || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: 15 }}>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Confirm Password: </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Role: </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          >
            <option value="student">Student</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: 10, width: "100%", cursor: "pointer" }}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      {message && (
        <p style={{ marginTop: 15, color: message.includes("✓") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Register;
