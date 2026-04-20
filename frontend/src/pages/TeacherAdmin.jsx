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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">
        Quản Lý Giáo Viên
      </h1>

      {/* Form Thêm Giáo Viên */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex flex-wrap gap-4 items-end">
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
      </div>

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
            ) : (
              teachers.map((gv) => (
                <tr
                  key={gv.id}
                  className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {editingId === gv.id ? (
                      <input
                        className="border rounded p-1 w-full"
                        value={gv.teacher_code}
                        onChange={(e) =>
                          setTeachers(
                            teachers.map((t) =>
                              t.id === gv.id
                                ? { ...t, teacher_code: e.target.value }
                                : t,
                            ),
                          )
                        }
                      />
                    ) : (
                      gv.teacher_code
                    )}
                  </td>
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
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeacherPage;
