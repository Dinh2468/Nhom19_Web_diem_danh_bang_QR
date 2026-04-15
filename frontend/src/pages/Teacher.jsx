import React, { useState, useEffect } from "react";
import axios from "axios";
const BASE_URL = "https://asyllabic-emelina-uncheated.ngrok-free.dev/api";
const Teacher_API_URL = `${BASE_URL}/teachers`;

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null); // null = thêm mới, có dữ liệu = đang sửa

  // State cho Form
  const [formData, setFormData] = useState({
    teacher_code: "",
    full_name: "",
    email: "",
  });

  const API_URL = Teacher_API_URL;
  const token = localStorage.getItem("token"); // Lấy token để xác thực

  // Cấu hình axios gửi kèm token
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(Teacher_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Thêm dòng này để "vượt rào" Ngrok
          "ngrok-skip-browser-warning": "69420",
        },
      });
      setTeachers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi gọi API:", error.response);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Mở Modal (Thêm hoặc Sửa)
  const openModal = (teacher = null) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        teacher_code: teacher.teacher_code,
        full_name: teacher.full_name,
        email: teacher.email,
      });
    } else {
      setEditingTeacher(null);
      setFormData({ teacher_code: "", full_name: "", email: "" });
    }
    setShowModal(true);
  };

  // Thêm hoặc Cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        // UPDATE
        await axios.put(
          `${API_URL}/${editingTeacher.id}`,
          formData,
          axiosConfig,
        );
        alert("Cập nhật thành công!");
      } else {
        // CREATE
        await axios.post(API_URL, formData, axiosConfig);
        alert("Thêm mới thành công!");
      }
      setShowModal(false);
      fetchTeachers();
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  // Xóa giảng viên
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giảng viên này không?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, axiosConfig);
        fetchTeachers();
      } catch (error) {
        alert("Không thể xóa giảng viên này!");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4">
      {/* Header */}
      <div className="p-6 flex justify-between items-center bg-white border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản Lý Giảng Viên
          </h1>
          <p className="text-sm text-gray-500">
            Danh sách toàn bộ giảng viên trong hệ thống
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center font-semibold shadow-lg transition-all"
        >
          Thêm Giảng Viên
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Mã GV
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Họ và Tên
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-10">
                  Đang tải...
                </td>
              </tr>
            ) : (
              teachers.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-indigo-600">
                    {t.teacher_code}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {t.full_name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{t.email}</td>
                  <td className="px-6 py-4 space-x-3">
                    <button
                      onClick={() => openModal(t)}
                      className="text-blue-600 hover:underline"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingTeacher ? "Sửa Giảng Viên" : "Thêm Giảng Viên"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="teacher_code"
                placeholder="Mã Giảng Viên (MSGV)"
                value={formData.teacher_code}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                required
              />
              <input
                name="full_name"
                placeholder="Họ và tên"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                required
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Lưu lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teacher;
