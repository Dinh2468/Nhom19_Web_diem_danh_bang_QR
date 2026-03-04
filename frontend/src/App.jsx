import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Gọi API từ Backend Laravel của bạn
    axios
      .get("https://asyllabic-emelina-uncheated.ngrok-free.dev/api/sinh-vien")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Lỗi gọi API:", err));
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#2c3e50" }}>Hệ thống điểm danh QR - Nhóm 19</h1>
      <table
        border="1"
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th>ID</th>
            <th>Họ và tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv) => (
            <tr key={sv.id} style={{ textAlign: "center" }}>
              <td>{sv.id}</td>
              <td style={{ textAlign: "left", paddingLeft: "10px" }}>
                {sv.name}
              </td>
              <td>{sv.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
