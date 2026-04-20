import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CourseAdmin() {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    course_name: "",
    subject_id: "",
    teacher_id: "",
    class_id: "",
  });

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "ngrok-skip-browser-warning": "69420",
    },
  });

  // Tải tất cả dữ liệu cần thiết
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resCourse, resSub, resTea, resCla] = await Promise.all([
        axios.get(`${BASE_URL}/courses`, getAuthHeader()),
        axios.get(`${BASE_URL}/subjects`, getAuthHeader()),
        axios.get(`${BASE_URL}/teachers`, getAuthHeader()),
        axios.get(`${BASE_URL}/classes`, getAuthHeader()),
      ]);
      setCourses(resCourse.data.data || []);
      setSubjects(resSub.data || []);
      setTeachers(resTea.data || []);
      setClasses(resCla.data || []);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/courses`, formData, getAuthHeader());
      alert("Thêm khóa học thành công!");
      setFormData({
        course_name: "",
        subject_id: "",
        teacher_id: "",
        class_id: "",
      });
      fetchData();
    } catch (err) {
      alert("Lỗi: " + err.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khóa học này?")) {
      await axios.delete(`${BASE_URL}/courses/${id}`, getAuthHeader());
      fetchData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6">Thêm Học phần / Khóa học mới</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <input
            type="text"
            placeholder="Tên học phần (VD: Lập trình PHP)"
            className="border p-3 rounded-xl text-sm"
            value={formData.course_name}
            onChange={(e) =>
              setFormData({ ...formData, course_name: e.target.value })
            }
            required
          />
          <select
            className="border p-3 rounded-xl text-sm"
            value={formData.subject_id}
            onChange={(e) =>
              setFormData({ ...formData, subject_id: e.target.value })
            }
            required
          >
            <option value="">-- Chọn Môn học --</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.subject_name}
              </option>
            ))}
          </select>
          <select
            className="border p-3 rounded-xl text-sm"
            value={formData.teacher_id}
            onChange={(e) =>
              setFormData({ ...formData, teacher_id: e.target.value })
            }
            required
          >
            <option value="">-- Chọn Giảng viên --</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.full_name}
              </option>
            ))}
          </select>
          <select
            className="border p-3 rounded-xl text-sm"
            value={formData.class_id}
            onChange={(e) =>
              setFormData({ ...formData, class_id: e.target.value })
            }
            required
          >
            <option value="">-- Chọn Lớp --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.class_name}
              </option>
            ))}
          </select>
          <button className="bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
            Thêm mới
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Danh sách học phần hệ thống
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs uppercase border-b border-gray-50">
                <th className="p-4">Tên học phần</th>
                <th className="p-4">Môn học</th>
                <th className="p-4">Giảng viên</th>
                <th className="p-4">Lớp</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10">
                    Đang tải...
                  </td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition"
                  >
                    <td className="p-4 font-bold text-gray-900">
                      {c.course_name}
                    </td>
                    <td className="p-4 text-gray-600">{c.subject_name}</td>
                    <td className="p-4 text-gray-600">{c.full_name}</td>
                    <td className="p-4">
                      <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
                        {c.class_name}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-500 font-bold hover:underline"
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
      </div>
    </div>
  );
}

export default CourseAdmin;
