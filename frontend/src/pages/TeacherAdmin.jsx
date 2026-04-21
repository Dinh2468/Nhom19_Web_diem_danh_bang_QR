import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://asyllabic-emelina-uncheated.ngrok-free.dev/api";
const TEACHER_API_URL = `${BASE_URL}/teachers`;

function TeacherPage() {
  const [teachers, setTeachers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [teacherCode, setTeacherCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Lấy Header chứa Token
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "69420",
      },
    };
  };

  // 1. Lấy danh sách giáo viên
  const fetchTeachers = useCallback(() => {
    setLoading(true);
    axios
      .get(TEACHER_API_URL, getAuthHeader())
      .then((res) => {
        setTeachers(res.data || []);
      })
      .catch((err) => console.error("Lỗi lấy danh sách giáo viên:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // 2. Logic tìm kiếm: Lọc danh sách dựa trên tên hoặc mã giáo viên
  const filteredTeachers = teachers.filter(
    (gv) =>
      gv.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gv.teacher_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gv.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 2. Thêm giáo viên mới
  const addTeacher = () => {
    if (!fullName || !email || !teacherCode) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    axios
      .post(
        TEACHER_API_URL,
        { full_name: fullName, email, teacher_code: teacherCode },
        getAuthHeader(),
      )
      .then(() => {
        setFullName("");
        setEmail("");
        setTeacherCode("");
        fetchTeachers();
      })
      .catch((err) =>
        alert("Lỗi khi thêm: " + (err.response?.data?.message || err.message)),
      );
  };

  // 3. Cập nhật giáo viên
  const updateTeacher = (id) => {
    const teacher = teachers.find((t) => t.id === id);
    axios
      .put(`${TEACHER_API_URL}/${id}`, teacher, getAuthHeader())
      .then(() => {
        setEditingId(null);
        fetchTeachers();
      })
      .catch((err) => alert("Lỗi khi cập nhật"));
  };

  // 4. Xóa giáo viên
  const deleteTeacher = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giáo viên này?")) {
      axios
        .delete(`${TEACHER_API_URL}/${id}`, getAuthHeader())
        .then(() => fetchTeachers())
        .catch((err) => alert("Lỗi khi xóa"));
    }
  };

  return (
    <div className="relative space-y-8 overflow-hidden py-4">
      <div className="absolute top-0 -left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-10 right-0 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative flex items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Quản lý Giáo Viên
          </h2>
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
            placeholder="Tìm kiếm giáo viên theo tên, mã hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* Form Thêm Giáo Viên */}
      {/* <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 mb-1">
            MÃ GIÁO VIÊN
          </label>
          <input
            className="w-full border-2 border-gray-100 rounded-lg p-2 focus:border-indigo-400 outline-none transition-all"
            value={teacherCode}
            onChange={(e) => setTeacherCode(e.target.value)}
            placeholder="GV001..."
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 mb-1">
            HỌ TÊN
          </label>
          <input
            className="w-full border-2 border-gray-100 rounded-lg p-2 focus:border-indigo-400 outline-none transition-all"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nguyễn Văn A..."
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 mb-1">
            EMAIL
          </label>
          <input
            className="w-full border-2 border-gray-100 rounded-lg p-2 focus:border-indigo-400 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@vi-du.com"
          />
        </div>
        <button
          onClick={addTeacher}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
        >
          Thêm Giáo Viên
        </button>
      </div> */}

      {/* Bảng Danh Sách */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">
                Mã GV
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">
                Họ Tên
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">
                Email
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredTeachers.length > 0 ? (
              filteredTeachers.map((gv) => (
                <tr
                  key={gv.id}
                  className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-600">{gv.teacher_code}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {editingId === gv.id ? (
                      <input
                        className="border rounded p-1 w-full"
                        value={gv.full_name}
                        onChange={(e) =>
                          setTeachers(
                            teachers.map((t) =>
                              t.id === gv.id
                                ? { ...t, full_name: e.target.value }
                                : t,
                            ),
                          )
                        }
                      />
                    ) : (
                      gv.full_name
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {editingId === gv.id ? (
                      <input
                        className="border rounded p-1 w-full"
                        value={gv.email}
                        onChange={(e) =>
                          setTeachers(
                            teachers.map((t) =>
                              t.id === gv.id
                                ? { ...t, email: e.target.value }
                                : t,
                            ),
                          )
                        }
                      />
                    ) : (
                      gv.email
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4 justify-center">
                      {editingId === gv.id ? (
                        <>
                          <button
                            onClick={() => updateTeacher(gv.id)}
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
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingId(gv.id)}
                            className="text-indigo-600 font-bold"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => deleteTeacher(gv.id)}
                            className="text-red-500 font-bold"
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  Không có giáo viên nào để hiển thị.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeacherPage;
