import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

// Link API Railway
const API_URL =
  "https://nhom19webdiemdanhbangqr-production.up.railway.app/api/sinh-vien";

function StudentPage() {
  const [students, setStudents] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");

  // 1. Lấy danh sách (READ)
  const fetchStudents = useCallback(() => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setStudents(data || []);
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu:", err))
      .finally(() => setLoading(false));
  }, []); // Mảng phụ thuộc rỗng

  useEffect(() => {
    fetchStudents();

    // Gọi API lấy danh sách lớp
    axios
      .get(
        "https://nhom19webdiemdanhbangqr-production.up.railway.app/api/lop-hoc",
      )
      .then((res) => {
        // Tùy vào cấu trúc Backend trả về, thường là res.data.data
        setClasses(res.data.data || res.data);
      })
      .catch((err) => console.error("Lỗi lấy danh sách lớp:", err));
  }, [fetchStudents]);

  // 2. Thêm sinh viên (CREATE)
  const addStudent = (e) => {
    e.preventDefault();
    axios
      .post(API_URL, {
        full_name: fullName,
        email: email,
        student_code: studentCode,
        class_id: 1,
      })
      .then(() => {
        setFullName("");
        setEmail("");
        setStudentCode("");
        fetchStudents();
        alert("Thêm thành công!");
      })
      .catch((err) => {
        alert("Lỗi: Mã SV hoặc Email có thể đã tồn tại.");
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
    if (window.confirm("Bạn chắc chắn muốn xóa sinh viên này?")) {
      axios.delete(`${API_URL}/${id}`).then(() => fetchStudents());
    }
  };

  return (
    <div className="space-y-8">
      {/* Tiêu đề trang */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Sinh viên</h2>
      </div>

      {/* FORM THÊM MỚI */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Thêm sinh viên mới
        </h3>
        <form
          onSubmit={addStudent}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            placeholder="Mã SV"
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            required
          />
          <input
            placeholder="Họ tên"
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="border border-gray-300 rounded-md p-2 bg-white text-gray-900"
            required
          >
            <option value="">-- Chọn lớp --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.class_name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Thêm mới
          </button>
        </form>
      </section>

      {/* BẢNG DANH SÁCH */}
      <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Mã SV</th>
              <th className="px-6 py-3">Họ tên</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Lớp</th>
              <th className="px-6 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : (
              students.map((sv) => (
                <tr key={sv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {sv.id}
                  </td>
                  <td className="px-6 py-4">{sv.student_code}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {editingId === sv.id ? (
                      <input
                        className="border border-blue-400 rounded px-2 py-1 outline-none w-full"
                        value={sv.full_name}
                        onChange={(e) =>
                          handleInputChange(sv.id, "full_name", e.target.value)
                        }
                      />
                    ) : (
                      sv.full_name
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === sv.id ? (
                      <input
                        className="border border-blue-400 rounded px-2 py-1 outline-none w-full"
                        value={sv.email}
                        onChange={(e) =>
                          handleInputChange(sv.id, "email", e.target.value)
                        }
                      />
                    ) : (
                      sv.email
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {sv.classroom?.class_name || "Lớp 1"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-3">
                    {editingId === sv.id ? (
                      <>
                        <button
                          onClick={() => updateStudent(sv.id)}
                          className="text-green-600 hover:underline font-medium"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-500 hover:underline font-medium"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingId(sv.id)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteStudent(sv.id)}
                          className="text-red-600 hover:underline font-medium"
                        >
                          Xóa
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentPage;
