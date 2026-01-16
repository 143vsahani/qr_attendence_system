import React from "react";
import QRScanner from "./QRScanner";
import Report from "./Report";

const App = () => (
  <div>
    <h1>QR Attendance</h1>
    <QRScanner />
    <hr />
    <Report />
  </div>
);

export default App;
