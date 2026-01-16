import React, { useState, useRef, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

const QRScanner = () => {
  const [lastScan, setLastScan] = useState("");
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-scanner",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const handleScan = async (data) => {
      if (!data || data === lastScan) return;
      setLastScan(data);
      try {
        const res = await axios.post("http://localhost:8000/api/mark-attendance/", { qr_code: data });
        alert(res.data.message || "Marked");
      } catch (err) {
        const msg = err.response?.data?.error || "Error marking attendance";
        alert(msg);
      }
    };

    scanner.render(handleScan, (err) => console.error(err));
    scannerRef.current = scanner;

    return () => {
      scanner.clear();
    };
  }, [lastScan]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Scan QR Code</h2>
      <div id="qr-scanner" style={{ width: "100%" }}></div>
      <p>Last scanned: {lastScan}</p>
    </div>
  );
};

export default QRScanner;
