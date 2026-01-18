import React, { useState, useRef, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "./axios";

const QRScanner = () => {
  const [userQR, setUserQR] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [scannedCount, setScannedCount] = useState(0);
  const scannerRef = useRef(null);
  const debounceRef = useRef(null);
  const lastScannedRef = useRef("");

  // Fetch user profile and QR code
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get("profile/");
        console.log("Profile fetched:", res.data);
        setUserQR(res.data.qr_code);
        setUsername(res.data.username);
        setUserId(res.data.user_id);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setMessage("❌ Error loading user profile");
      }
    };

    fetchUserProfile();
  }, []);

  // Setup QR scanner
  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner(
      "qr-scanner",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        disableFlip: false 
      },
      false
    );

    const handleScan = async (data) => {
      console.log("QR Scanned:", data);
      
      // Prevent duplicate scans within 2 seconds
      if (data === lastScannedRef.current) {
        console.log("Same QR scanned again, ignoring...");
        return;
      }

      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        lastScannedRef.current = data;
        setScannedCount(prev => prev + 1);
        setMessage(`📍 Processing QR: ${data.substring(0, 20)}...`);
        
        try {
          console.log("Sending mark attendance request:", { qr_code: data });
          const res = await api.post("mark-attendance/", { qr_code: data });
          console.log("Success response:", res.data);
          setMessage("✅ " + (res.data.message || "Attendance marked successfully!"));
          
          // Reset after 4 seconds to allow new scans
          setTimeout(() => {
            lastScannedRef.current = "";
            setMessage("");
          }, 4000);
        } catch (err) {
          console.error("Error marking attendance:", err);
          const msg = err.response?.data?.error || err.message || "Error marking attendance";
          setMessage("❌ " + msg);
          
          // Reset after 4 seconds to allow retry
          setTimeout(() => {
            lastScannedRef.current = "";
          }, 4000);
        }
      }, 300);
    };

    const onError = (err) => {
      if (typeof err === "string") {
        console.log("Scanner info:", err);
      } else {
        console.error("Scanner error:", err);
      }
    };

    scanner.render(handleScan, onError);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        try {
          scanner.clear();
        } catch (e) {
          console.error("Error clearing scanner:", e);
        }
      }
    };
  }, [isScanning]);

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>📱 Scan QR Code to Mark Attendance</h2>
      
      {/* Display User's QR Code */}
      {userQR && userId && (
        <div style={{ 
          marginBottom: 30, 
          padding: 20, 
          backgroundColor: "#f0f0f0", 
          borderRadius: 8,
          textAlign: "center",
          border: "2px solid #ddd"
        }}>
          <h3>Your QR Code</h3>
          <p>User: <strong>{username}</strong></p>
          <div style={{ marginTop: 10 }}>
            <img 
              src={`http://localhost:8000/api/user-qr/${userId}/`} 
              alt="User QR Code"
              style={{ 
                width: 200, 
                height: 200, 
                border: "2px solid #333",
                padding: 5,
                backgroundColor: "white"
              }}
              onError={(e) => {
                console.log("Failed to load QR image from:", e.target.src);
                setMessage("⚠️ QR image not loading");
              }}
              onLoad={() => {
                console.log("QR image loaded successfully");
              }}
            />
          </div>
          <p style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
            QR Code: <code>{userQR}</code>
          </p>
        </div>
      )}

      {/* Loading message */}
      {!userQR && (
        <div style={{
          marginBottom: 30,
          padding: 20,
          backgroundColor: "#e3f2fd",
          borderRadius: 8,
          textAlign: "center",
          border: "2px solid #bbdefb"
        }}>
          <p>⏳ Loading your QR code...</p>
        </div>
      )}

      {/* QR Scanner */}
      <div style={{ 
        marginBottom: 20, 
        padding: 20, 
        backgroundColor: "#f9f9f9", 
        borderRadius: 8,
        border: "2px solid #ddd"
      }}>
        <h3>Scanner 📷</h3>
        <p style={{ fontSize: 12, color: "#666" }}>
          {isScanning ? "🔴 Active - Point camera at QR code" : "⚪ Scanner paused"}
        </p>
        <div id="qr-scanner" style={{ width: "100%", minHeight: 300 }}></div>
        <button 
          onClick={() => setIsScanning(!isScanning)}
          style={{
            marginTop: 10,
            padding: 10,
            backgroundColor: isScanning ? "#f44336" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            width: "100%",
            fontSize: 14,
            fontWeight: "bold"
          }}
        >
          {isScanning ? "⏸ Pause Scanner" : "▶ Resume Scanner"}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: 15,
          backgroundColor: message.includes("✅") ? "#d4edda" : message.includes("⚠️") ? "#fff3cd" : "#f8d7da",
          color: message.includes("✅") ? "#155724" : message.includes("⚠️") ? "#856404" : "#721c24",
          borderRadius: 5,
          marginTop: 15,
          border: "1px solid",
          borderColor: message.includes("✅") ? "#c3e6cb" : message.includes("⚠️") ? "#ffeaa7" : "#f5c6cb",
          fontSize: 14,
          fontWeight: "bold"
        }}>
          {message}
        </div>
      )}

      <div style={{
        marginTop: 20,
        padding: 15,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        fontSize: 12,
        color: "#666"
      }}>
        <p><strong>Scans completed:</strong> {scannedCount}</p>
        <p><strong>Status:</strong> {isScanning ? "🔴 Scanning active" : "⚪ Paused"}</p>
      </div>
    </div>
  );
};

export default QRScanner;
