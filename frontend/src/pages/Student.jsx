import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const STUDENT_API_URL = `${BASE_URL}/sinh-vien`;
const CLASS_API_URL = `${BASE_URL}/lop-hoc`;

function StudentPage() {
  const [students, setStudents] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");

  // 1. Lấy danh sách sinh viên
  const fetchStudents = useCallback(() => {
    setLoading(true);
    axios
      .get(STUDENT_API_URL)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setStudents(data || []);
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu:", err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Lấy danh sách lớp
  useEffect(() => {
    fetchStudents();
    axios
      .get(CLASS_API_URL)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setClasses(data || []);
      })
      .catch((err) => console.error("Lỗi lấy danh sách lớp:", err));
  }, []);

  // 3. Thêm sinh viên
  const addStudent = (e) => {
    e.preventDefault();
    if (!classId) {
      alert("Vui lòng chọn lớp học!");
      return;
    }
    axios
      .post(STUDENT_API_URL, {
        full_name: fullName,
        email: email,
        student_code: studentCode,
        class_id: classId,
      })
      .then(() => {
        setFullName("");
        setEmail("");
        setStudentCode("");
        setClassId("");
        fetchStudents();
        alert("Thêm thành công!");
      })
      .catch((err) => alert("Lỗi: Mã SV hoặc Email có thể đã tồn tại."));
  };

  // 4. Cập nhật sinh viên
  const updateStudent = (id) => {
    const sv = students.find((item) => item.id === id);
    axios
      .put(`${STUDENT_API_URL}/${id}`, {
        full_name: sv.full_name,
        email: sv.email,
        class_id: sv.class_id,
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

  // 5. Xóa sinh viên
  const deleteStudent = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa sinh viên này?")) {
      axios.delete(`${STUDENT_API_URL}/${id}`).then(() => fetchStudents());
    }
  };

  return (
    <div className="relative space-y-8 overflow-hidden py-4">
      {/* Khối màu loang làm nền mờ ảo đồng bộ */}
      <div className="absolute top-0 -left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-10 right-0 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      {/* HEADER TRANG */}
      <div className="relative flex items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Quản lý Sinh viên
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Lưu trữ và điều chỉnh danh sách sinh viên trong hệ thống
          </p>
        </div>
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
      </div>

      {/* FORM THÊM MỚI (Nâng cấp giao diện kính mờ) */}
      <section className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/30">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
          <h3 className="text-lg font-bold text-gray-800">
            Thêm sinh viên mới
          </h3>
        </div>

        <form
          onSubmit={addStudent}
          className="grid grid-cols-1 md:grid-cols-5 gap-5"
        >
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Mã SV
            </label>
            <input
              placeholder="Ví dụ: SV001"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50/50 text-sm"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Họ tên
            </label>
            <input
              placeholder="Nhập họ và tên"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50/50 text-sm"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Email
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50/50 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Lớp học
            </label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50/50 text-sm text-gray-700 cursor-pointer"
              required
            >
              <option value="">-- Chọn lớp --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 flex items-center justify-center text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Thêm mới
            </button>
          </div>
        </form>
      </section>

      {/* BẢNG DANH SÁCH (Nâng cấp giao diện thẻ cao cấp) */}
      <div className="relative bg-white/90 backdrop-blur-sm shadow-xl shadow-gray-200/30 border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50/80">
            <tr>
              <th className="px-6 py-4 font-bold">ID</th>
              <th className="px-6 py-4 font-bold">Mã SV</th>
              <th className="px-6 py-4 font-bold">Họ tên</th>
              <th className="px-6 py-4 font-bold">Email</th>
              <th className="px-6 py-4 font-bold">Lớp</th>
              <th className="px-6 py-4 font-bold text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
                  <div className="text-gray-500 font-medium">
                    Đang tải dữ liệu...
                  </div>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400">
                  Chưa có sinh viên nào trong danh sách.
                </td>
              </tr>
            ) : (
              students.map((sv) => (
                <tr
                  key={sv.id}
                  className="hover:bg-indigo-50/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-bold text-indigo-600">
                    #{sv.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {sv.student_code}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === sv.id ? (
                      <input
                        className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
                        value={sv.full_name}
                        onChange={(e) =>
                          handleInputChange(sv.id, "full_name", e.target.value)
                        }
                      />
                    ) : (
                      <span className="font-medium text-gray-700">
                        {sv.full_name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === sv.id ? (
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
                        value={sv.email}
                        onChange={(e) =>
                          handleInputChange(sv.id, "email", e.target.value)
                        }
                      />
                    ) : (
                      <span className="text-gray-600">{sv.email}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === sv.id ? (
                      <select
                        className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white cursor-pointer"
                        value={sv.class_id}
                        onChange={(e) =>
                          handleInputChange(sv.id, "class_id", e.target.value)
                        }
                      >
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.class_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-indigo-100">
                        {sv.classroom?.class_name || "Chưa xếp lớp"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingId === sv.id ? (
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => updateStudent(sv.id)}
                          className="text-green-600 hover:text-green-700 font-bold text-sm flex items-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-400 hover:text-gray-600 font-bold text-sm flex items-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => setEditingId(sv.id)}
                          className="text-indigo-600 hover:text-indigo-800 font-bold text-sm flex items-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteStudent(sv.id)}
                          className="text-red-500 hover:text-red-700 font-bold text-sm flex items-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Xóa
                        </button>
                      </div>
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
