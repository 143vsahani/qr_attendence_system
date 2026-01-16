import React, { useEffect, useState } from "react";
import axios from "axios";

const Report = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/attendance-report/")
      .then(res => setRows(res.data))
      .catch(() => alert("Failed to load report"));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Attendance Report</h2>
      {rows.length === 0 ? (
        <p>No attendance records yet</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>User</th><th>Date</th><th>Time</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td>{r.user}</td>
                <td>{r.date}</td>
                <td>{r.time}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Report;
