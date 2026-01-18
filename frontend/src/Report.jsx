import React, { useEffect, useState } from "react";
import api from "./axios";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Report = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("attendance-report/")
      .then((res) => setRows(res.data))
      .catch((err) => console.error(err));
  }, []);

  const data = {
    labels: rows.length > 0 ? rows.map(r => r.user) : ['No Data'],
    datasets: [
      {
        label: 'Attendance Count',
        data: rows.length > 0 ? rows.map(r => 1) : [0],
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Attendance Report</h2>
      {rows.length === 0 ? (
        <p>No attendance records yet</p>
      ) : (
        <>
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", marginBottom: 20 }}>
            <thead>
              <tr>
                <th>User</th><th>Date</th><th>Time</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.user}</td>
                  <td>{r.date}</td>
                  <td>{r.time}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ width: 400 }}>
            <Bar data={data} />
          </div>
        </>
      )}
    </div>
  );
};

export default Report;

