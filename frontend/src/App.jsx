import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://asyllabic-emelina-uncheated.ngrok-free.dev/api/sinh-vien";
const headers = { "ngrok-skip-browser-warning": "true" };

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 1. Lấy danh sách (READ)
  const fetchStudents = () => {
    axios
      .get(API_URL, { headers })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setStudents(data || []);
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu:", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. Thêm sinh viên (CREATE)
  const addStudent = (e) => {
    e.preventDefault();
    axios
      .post(API_URL, { name, email }, { headers })
      .then(() => {
        setName("");
        setEmail(""); // Xóa form
        fetchStudents(); // Load lại bảng
      })
      .catch((err) => {
        console.error("Chi tiết lỗi:", err);
        alert("Lỗi khi thêm!");
      });
  };

  // 3. Xóa sinh viên (DELETE)
  const deleteStudent = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa sinh viên này?")) {
      axios
        .delete(`${API_URL}/${id}`, { headers })
        .then(() => fetchStudents())
        .catch((err) => {
          console.error("Chi tiết lỗi:", err);
          alert("Lỗi khi xóa!");
        });
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial",
      }}
    >
      <h2>Quản lý Sinh viên - Nhóm 19</h2>

      {/* FORM THÊM MỚI */}
      <form
        onSubmit={addStudent}
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ddd",
        }}
      >
        <input
          type="text"
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginLeft: "10px" }}
        />
        <button
          type="submit"
          style={{
            marginLeft: "10px",
            backgroundColor: "green",
            color: "white",
          }}
        >
          Thêm mới
        </button>
      </form>

      {/* BẢNG DANH SÁCH */}
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#f4f4f4" }}>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Hành động</th>
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
              <td>
                <button
                  onClick={() => deleteStudent(sv.id)}
                  style={{ color: "red" }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
