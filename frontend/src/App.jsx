import React, { useState, useEffect } from "react";
import QRScanner from "./QRScanner";
import Report from "./Report";
import Login from "./Login";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user has a token
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          <h1>QR Attendance</h1>
          <button onClick={handleLogout} style={{ marginBottom: 20 }}>
            Logout
          </button>
          <QRScanner />
          <hr />
          <Report />
        </div>
      )}
    </div>
  );
};

export default App;
