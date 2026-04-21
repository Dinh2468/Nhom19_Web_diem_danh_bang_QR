import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STUDENT_API_URL = `${BASE_URL}/sinh-vien`;
const CLASS_API_URL = `${BASE_URL}/classes`;

function StudentPage() {
  const [students, setStudents] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Hàm lấy Header tự động (Tránh lỗi 401/trắng trang nếu API yêu cầu Token)
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token
      ? {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420", // Thêm dòng này
        }
      : { "ngrok-skip-browser-warning": "69420" };
  };

  // 1. Lấy danh sách sinh viên
  const fetchStudents = useCallback(() => {
    setLoading(true);
    axios
      .get(STUDENT_API_URL, { headers: getAuthHeader() })
      .then((res) => {
        // Kiểm tra cấu trúc data trả về
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setStudents(data || []);
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu sinh viên:", err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Lấy danh sách lớp và sinh viên khi load trang
  useEffect(() => {
    fetchStudents();
    axios
      .get(CLASS_API_URL, { headers: getAuthHeader() })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setClasses(data || []);
      })
      .catch((err) => console.error("Lỗi lấy danh sách lớp:", err));
  }, [fetchStudents]);

  // 3. Thêm sinh viên
  const addStudent = (e) => {
    e.preventDefault();
    if (!classId) return alert("Vui lòng chọn lớp học!");

    axios
      .post(
        STUDENT_API_URL,
        {
          full_name: fullName,
          email: email,
          student_code: studentCode,
          class_id: classId,
        },
        { headers: getAuthHeader() },
      )
      .then(() => {
        setFullName("");
        setEmail("");
        setStudentCode("");
        setClassId("");
        fetchStudents();
        alert("Thêm thành công!");
      })
      .catch((err) => alert("Lỗi: Mã SV/Email đã tồn tại hoặc thiếu quyền!"));
  };

  // 4. Cập nhật sinh viên
  const updateStudent = (id) => {
    const sv = students.find((item) => item.id === id);
    axios
      .put(
        `${STUDENT_API_URL}/${id}`,
        {
          full_name: sv.full_name,
          email: sv.email,
          class_id: sv.class_id,
        },
        { headers: getAuthHeader() },
      )
      .then(() => {
        setEditingId(null);
        alert("Cập nhật thành công!");
        fetchStudents();
      })
      .catch((err) => console.error("Lỗi cập nhật:", err));
  };
  // Hàm xử lý thay đổi input khi đang edit (Cập nhật state ngay khi nhập)
  const handleInputChange = (id, field, value) => {
    setStudents((prev) =>
      prev.map((sv) => (sv.id === id ? { ...sv, [field]: value } : sv)),
    );
  };

  // 5. Xóa sinh viên
  const deleteStudent = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa sinh viên này?")) {
      axios
        .delete(`${STUDENT_API_URL}/${id}`, { headers: getAuthHeader() })
        .then(() => fetchStudents())
        .catch((err) => console.error("Lỗi xóa:", err));
    }
  };
  // 6. Logic tìm kiếm: Lọc danh sách dựa trên tên hoặc mã sinh viên
  const filteredStudents = students.filter(
    (sv) =>
      sv.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sv.student_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sv.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sv.classroom?.class_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="relative space-y-8 overflow-hidden py-4">
      {/* Khối màu loang nền */}
      <div className="absolute top-0 -left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-10 right-0 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      {/* HEADER */}
      <div className="relative flex items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Quản lý Sinh viên
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Lưu trữ và điều chỉnh danh sách sinh viên
          </p>
        </div>
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <svg
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

      {/* Thanh tìm kiếm */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-8 border border-gray-100">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-50 rounded-xl focus:border-indigo-400 focus:bg-white bg-gray-50 outline-none transition-all"
            placeholder="Tìm kiếm sinh viên theo tên, mã hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* FORM THÊM MỚI */}
      {/* <section className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/30">
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
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Mã SV
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Họ tên
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Lớp học
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none text-sm cursor-pointer"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
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
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md flex items-center justify-center text-sm"
            >
              <svg
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
      </section> */}

      {/* BẢNG DANH SÁCH */}
      <div className="relative bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50/80">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Mã SV</th>
              <th className="px-6 py-4">Họ tên</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Lớp</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 inline-block"></div>
                </td>
              </tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((sv) => (
                <tr
                  key={sv.id}
                  className="hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-indigo-600">
                    #{sv.id}
                  </td>
                  <td className="px-6 py-4 font-semibold">{sv.student_code}</td>
                  <td className="px-6 py-4">
                    {editingId === sv.id ? (
                      <input
                        className="w-full border rounded-lg px-2 py-1 outline-none focus:ring-1 ring-indigo-300"
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
                        className="w-full border rounded-lg px-2 py-1 outline-none"
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
                    {editingId === sv.id ? (
                      <select
                        className="w-full border rounded-lg px-2 py-1"
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
                      <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-indigo-100">
                        {sv.classroom?.class_name || "Chưa xếp lớp"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingId === sv.id ? (
                      <div className="flex gap-3 justify-center text-sm">
                        <button
                          onClick={() => updateStudent(sv.id)}
                          className="text-green-600 font-bold"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-400 font-bold"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-4 justify-center text-sm">
                        <button
                          onClick={() => setEditingId(sv.id)}
                          className="text-indigo-600 font-bold"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteStudent(sv.id)}
                          className="text-red-500 font-bold"
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400">
                  Không tìm thấy sinh viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentPage;
