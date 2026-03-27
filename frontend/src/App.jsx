import React, { useEffect, useState } from "react";
import axios from "axios";

// Link API Railway của bạn
const API_URL =
  "https://nhom19webdiemdanhbangqr-production.up.railway.app/api/sinh-vien";

function App() {
  const [students, setStudents] = useState([]);
  const [fullName, setFullName] = useState(""); // Đổi từ name -> fullName
  const [email, setEmail] = useState("");
  const [studentCode, setStudentCode] = useState(""); // Thêm mã sinh viên
  const [editingId, setEditingId] = useState(null);

  // 1. Lấy danh sách (READ)
  const fetchStudents = () => {
    axios
      .get(API_URL)
      .then((res) => {
        // Laravel trả về data trực tiếp hoặc qua res.data
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
      .post(API_URL, {
        full_name: fullName, // Khớp với fillable trong Model
        email: email,
        student_code: studentCode, // Cần thiết cho database
        class_id: 1, // Gán mặc định vào lớp 1 để test nhanh
      })
      .then(() => {
        setFullName("");
        setEmail("");
        setStudentCode("");
        fetchStudents();
        alert("Thêm thành công!");
      })
      .catch((err) => {
        console.error("Lỗi thêm:", err.response?.data || err);
        alert("Lỗi khi thêm! Kiểm tra lại mã SV hoặc Email trùng.");
      });
  };

  // 3. Cập nhật (UPDATE)
  const updateStudent = (id) => {
    const sv = students.find((item) => item.id === id);
    axios
      .put(`${API_URL}/${id}`, {
        full_name: sv.full_name,
        email: sv.email,
      })
      .then(() => {
        setEditingId(null);
        alert("Cập nhật thành công!");
        fetchStudents();
      })
      .catch((err) => console.error("Lỗi cập nhật:", err));
  };

  const handleInputChange = (id, field, value) => {
    setStudents(
      students.map((sv) => (sv.id === id ? { ...sv, [field]: value } : sv)),
    );
  };

  // 4. Xóa (DELETE)
  const deleteStudent = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa?")) {
      axios.delete(`${API_URL}/${id}`).then(() => fetchStudents());
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial",
        backgroundColor: "#1e1e1e",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Quản lý Sinh viên - Nhóm 19</h2>

      {/* FORM THÊM MỚI */}
      <form
        onSubmit={addStudent}
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #444",
          borderRadius: "8px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Mã SV"
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value)}
          required
          style={{ padding: "8px" }}
        />
        <input
          placeholder="Họ tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={{ padding: "8px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Thêm mới
        </button>
      </form>

      {/* BẢNG DANH SÁCH */}
      <table
        border="1"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          borderColor: "#444",
        }}
      >
        <thead style={{ backgroundColor: "#333" }}>
          <tr>
            <th>ID</th>
            <th>Mã SV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Lớp</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv) => (
            <tr
              key={sv.id}
              style={{ textAlign: "center", borderBottom: "1px solid #444" }}
            >
              <td>{sv.id}</td>
              <td>{sv.student_code}</td>
              <td>
                {editingId === sv.id ? (
                  <input
                    value={sv.full_name}
                    onChange={(e) =>
                      handleInputChange(sv.id, "full_name", e.target.value)
                    }
                  />
                ) : (
                  sv.full_name
                )}
              </td>
              <td>
                {editingId === sv.id ? (
                  <input
                    value={sv.email}
                    onChange={(e) =>
                      handleInputChange(sv.id, "email", e.target.value)
                    }
                  />
                ) : (
                  sv.email
                )}
              </td>
              <td>{sv.classroom?.class_name || "N/A"}</td>
              <td style={{ padding: "10px" }}>
                {editingId === sv.id ? (
                  <>
                    <button
                      onClick={() => updateStudent(sv.id)}
                      style={{ color: "#007bff", marginRight: "10px" }}
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{ color: "#fff" }}
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingId(sv.id)}
                      style={{ color: "orange", marginRight: "10px" }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deleteStudent(sv.id)}
                      style={{ color: "red" }}
                    >
                      Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
