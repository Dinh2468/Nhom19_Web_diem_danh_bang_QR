import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_URL =
  "https://nhom19webdiemdanhbangqr-production.up.railway.app/api/giao-vien";

function TeacherPage() {
  const [teachers, setTeachers] = useState([]);
  const [teacherCode, setTeacherCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTeachers = useCallback(() => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setTeachers(data || []);
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu giáo viên:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const addTeacher = (e) => {
    e.preventDefault();
    if (!teacherCode || !fullName || !email) {
      alert("Vui lòng điền đầy đủ thông tin giáo viên.");
      return;
    }

    axios
      .post(API_URL, {
        teacher_code: teacherCode,
        full_name: fullName,
        email,
      })
      .then(() => {
        setTeacherCode("");
        setFullName("");
        setEmail("");
        fetchTeachers();
        alert("Thêm giáo viên thành công!");
      })
      .catch((err) => {
        console.error("Lỗi thêm giáo viên:", err);
        alert("Không thể thêm giáo viên. Vui lòng kiểm tra lại dữ liệu.");
      });
  };

  const updateTeacher = (id) => {
    const teacher = teachers.find((item) => item.id === id);
    if (!teacher) return;

    axios
      .put(`${API_URL}/${id}`, {
        teacher_code: teacher.teacher_code,
        full_name: teacher.full_name,
        email: teacher.email,
      })
      .then(() => {
        setEditingId(null);
        fetchTeachers();
        alert("Cập nhật giáo viên thành công!");
      })
      .catch((err) => {
        console.error("Lỗi cập nhật giáo viên:", err);
        alert("Không thể cập nhật giáo viên. Vui lòng thử lại.");
      });
  };

  const handleInputChange = (id, field, value) => {
    setTeachers(
      teachers.map((teacher) =>
        teacher.id === id ? { ...teacher, [field]: value } : teacher,
      ),
    );
  };

  const deleteTeacher = (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa giáo viên này?")) {
      return;
    }

    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        fetchTeachers();
      })
      .catch((err) => {
        console.error("Lỗi xóa giáo viên:", err);
        alert("Không thể xóa giáo viên. Vui lòng thử lại.");
      });
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-300 pb-6">
        <h2 className="text-3xl font-bold text-gray-900">Quản lý Giáo viên</h2>
        <p className="text-gray-600 mt-2">Lưu trữ và điều chỉnh danh sách hộ sơ giáo viên trong hệ thống</p>
      </div>

      <section className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
          <span className="inline-block w-1 h-6 bg-blue-600 rounded"></span>
          Thêm giáo viên mới
        </h3>
        <form
          onSubmit={addTeacher}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            placeholder="Mã GV"
            className="border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={teacherCode}
            onChange={(e) => setTeacherCode(e.target.value)}
            required
          />
          <input
            placeholder="Họ tên"
            className="border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            + Thêm mới
          </button>
        </form>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
          <span className="inline-block w-1 h-6 bg-blue-600 rounded"></span>
          Danh sách giáo viên
        </h3>
        <div className="overflow-x-auto shadow-md border border-gray-300 rounded-xl">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs font-bold text-gray-900 uppercase bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Mã GV</th>
                <th className="px-6 py-4">Họ tên</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    ⏳ Đang tải dữ liệu...
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-blue-600">
                      #{teacher.id}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === teacher.id ? (
                        <input
                          className="border border-blue-400 rounded px-3 py-2 w-full"
                          value={teacher.teacher_code}
                          onChange={(e) =>
                            handleInputChange(
                              teacher.id,
                              "teacher_code",
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        teacher.teacher_code
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {editingId === teacher.id ? (
                        <input
                          className="border border-blue-400 rounded px-3 py-2 w-full"
                          value={teacher.full_name}
                          onChange={(e) =>
                            handleInputChange(
                              teacher.id,
                              "full_name",
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        teacher.full_name
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === teacher.id ? (
                        <input
                          type="email"
                          className="border border-blue-400 rounded px-3 py-2 w-full"
                          value={teacher.email}
                          onChange={(e) =>
                            handleInputChange(teacher.id, "email", e.target.value)
                          }
                        />
                      ) : (
                        teacher.email
                      )}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      {editingId === teacher.id ? (
                        <>
                          <button
                            onClick={() => updateTeacher(teacher.id)}
                            className="text-green-600 hover:text-green-700 font-bold hover:bg-green-50 px-3 py-2 rounded transition"
                          >
                            ✓ Lưu
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 hover:text-gray-700 font-bold hover:bg-gray-100 px-3 py-2 rounded transition"
                          >
                            ✕ Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingId(teacher.id)}
                            className="text-blue-600 hover:text-blue-700 font-bold hover:bg-blue-50 px-3 py-2 rounded transition"
                          >
                            ✎ Sửa
                          </button>
                          <button
                            onClick={() => deleteTeacher(teacher.id)}
                            className="text-red-600 hover:text-red-700 font-bold hover:bg-red-50 px-3 py-2 rounded transition"
                          >
                            🗑 Xóa
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
      </section>
    </div>
  );
}

export default TeacherPage;
