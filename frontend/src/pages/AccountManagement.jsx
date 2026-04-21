import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

// Lấy link từ env giống các file khác của bạn
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USER_API_URL = `${BASE_URL}/users`;

function AccountManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]); // Lấy danh sách lớp học để chọn khi tạo tài khoản sinh viên
  // Form state để thêm tài khoản
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    code: "",
    class_id: "",
  });

  // Hàm lấy header Authorization từ token lưu trong localStorage để gửi kèm trong các request
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "69420",
      },
    };
  };

  const fetchClasses = useCallback(() => {
    axios
      .get(`${BASE_URL}/classes`, getAuthHeader())
      .then((res) => setClasses(res.data || []))
      .catch((err) => console.error("Lỗi lấy danh sách lớp học:", err));
  }, []);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    axios
      .get(USER_API_URL, getAuthHeader())
      .then((res) => {
        setUsers(res.data || []);
      })
      .catch((err) => console.error("Lỗi lấy danh sách tài khoản:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchClasses();
  }, [fetchUsers, fetchClasses]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(USER_API_URL, formData, getAuthHeader());
      alert("Thêm tài khoản thành công!");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "student",
        code: "",
      });
      fetchUsers();
    } catch (err) {
      alert("Lỗi khi thêm tài khoản: " + err.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tài khoản này?")) {
      try {
        await axios.delete(`${USER_API_URL}/${id}`, getAuthHeader());
        fetchUsers();
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
      }
    }
  };

  return (
    <div className="relative space-y-8 overflow-hidden py-4">
      <div className="absolute top-0 -left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-10 right-0 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative flex items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Quản lý Tài khoản
          </h2>
        </div>
      </div>
      {/* Form thêm tài khoản */}
      <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Thêm tài khoản mới</h2>
        <form
          onSubmit={handleAddUser}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            placeholder="Họ tên"
            className="border p-2 rounded-lg"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded-lg"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="border p-2 rounded-lg"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <select
            className="border p-2 rounded-lg"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value, code: "" })
            }
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          {/* Chỉ để một ô input code duy nhất ở đây */}
          {formData.role !== "admin" && (
            <input
              type="text"
              placeholder={
                formData.role === "student" ? "Mã số sinh viên" : "Mã giáo viên"
              }
              className="border p-2 rounded-lg bg-blue-50"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              required
            />
          )}
          {formData.role === "student" && (
            <select
              className="border p-2 rounded-lg"
              value={formData.class_id} // Thêm trường class_id vào formData
              onChange={
                (e) => setFormData({ ...formData, class_id: e.target.value }) // Cập nhật class_id khi chọn lớp học
              }
              required // Bắt buộc chọn lớp học khi tạo tài khoản sinh viên
            >
              <option value="">Chọn lớp học</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          )}

          <button className="bg-indigo-600 text-white p-2 rounded-lg font-bold hover:bg-indigo-700 transition">
            Thêm
          </button>
        </form>
      </div>

      {/* Danh sách tài khoản */}
      <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Danh sách tài khoản
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                <th className="py-4 px-4">ID</th>
                <th className="py-4 px-4">Họ tên</th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4">Vai trò</th>
                <th className="py-4 px-4">Mã định danh</th>
                {/* <th className="py-4 px-4 text-right">Hành động</th> */}
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Đang tải...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="py-4 px-4 text-indigo-600 font-medium">
                      #{u.id}
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      {u.name}
                    </td>
                    <td className="py-4 px-4 text-gray-500">{u.email}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          u.role === "admin"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {u.student?.student_code ||
                        u.teacher?.teacher_code ||
                        "---"}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {/* <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-500 hover:underline font-bold"
                      >
                        Xóa
                      </button> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AccountManagement;
