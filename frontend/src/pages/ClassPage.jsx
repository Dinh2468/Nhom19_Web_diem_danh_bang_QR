import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = "https://asyllabic-emelina-uncheated.ngrok-free.dev/api";
const CLASS_API_URL = `${BASE_URL}/classes`;

function ClassPage() {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Hàm tạo Header chứa Token (Dùng chung cho tất cả yêu cầu)
  const getAuthHeader = () => {
    const token = localStorage.getItem("token"); // Lấy token từ lúc login
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  // 1. Hàm lấy danh sách lớp
  const fetchClasses = useCallback(() => {
    setLoading(true);
    axios
      .get(CLASS_API_URL, getAuthHeader()) // Thêm header ở đây
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setClasses(data || []);
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách lớp:", err);
        if (err.response?.status === 401)
          alert("Hết hạn đăng nhập, hãy login lại!");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // 2. Hàm thêm lớp mới
  const addClass = (e) => {
    e.preventDefault();
    axios
      .post(CLASS_API_URL, { class_name: className }, getAuthHeader()) // Thêm header
      .then(() => {
        setClassName("");
        fetchClasses();
        alert("Thêm lớp học thành công!");
      })
      .catch((err) => console.error("Lỗi thêm lớp:", err));
  };

  // 3. Hàm cập nhật tên lớp
  const updateClass = (id) => {
    const cls = classes.find((item) => item.id === id);
    axios
      .put(
        `${CLASS_API_URL}/${id}`,
        { class_name: cls.class_name },
        getAuthHeader(),
      ) // Thêm header
      .then(() => {
        setEditingId(null);
        alert("Cập nhật thành công!");
        fetchClasses();
      })
      .catch((err) => console.error("Lỗi cập nhật:", err));
  };

  const handleInputChange = (id, value) => {
    setClasses(
      classes.map((cls) =>
        cls.id === id ? { ...cls, class_name: value } : cls,
      ),
    );
  };

  // 4. Hàm xóa lớp
  const deleteClass = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa lớp học này?")) {
      axios
        .delete(`${CLASS_API_URL}/${id}`, getAuthHeader()) // Thêm header
        .then(() => fetchClasses())
        .catch((err) => console.error("Lỗi xóa lớp:", err));
    }
  };

  return (
    <div className="relative space-y-8 overflow-hidden py-4 px-4">
      {/* Hiệu ứng Background */}
      <div className="absolute top-0 -left-10 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>

      {/* HEADER */}
      <div className="relative flex items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Quản lý Lớp học
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Admin / Quản lý danh sách lớp học hệ thống
          </p>
        </div>
      </div>

      {/* FORM THÊM LỚP */}
      <section className="relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/30">
        <form
          onSubmit={addClass}
          className="flex flex-col md:flex-row gap-4 items-end"
        >
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Tên lớp học
            </label>
            <input
              placeholder="Ví dụ: D22_TH15"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all text-sm shadow-lg shadow-indigo-200"
          >
            Thêm mới lớp
          </button>
        </form>
      </section>

      {/* BẢNG DANH SÁCH */}
      <div className="relative bg-white/90 backdrop-blur-sm shadow-xl border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">Tên lớp</th>
                <th className="px-6 py-4 font-bold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-gray-400">
                    Đang tải dữ liệu lớp học...
                  </td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-10 text-gray-400 font-medium"
                  >
                    Chưa có lớp học nào được tìm thấy.
                  </td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr
                    key={cls.id}
                    className="hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-indigo-600">
                      #{cls.id}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === cls.id ? (
                        <input
                          className="w-full px-3 py-2 border border-indigo-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-indigo-200"
                          value={cls.class_name}
                          onChange={(e) =>
                            handleInputChange(cls.id, e.target.value)
                          }
                        />
                      ) : (
                        <span className="font-semibold text-gray-800">
                          {cls.class_name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editingId === cls.id ? (
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => updateClass(cls.id)}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-bold hover:bg-green-200"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-100 text-gray-500 px-3 py-1 rounded-md text-xs font-bold hover:bg-gray-200"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => setEditingId(cls.id)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold transition-transform hover:scale-110"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => deleteClass(cls.id)}
                            className="text-red-500 hover:text-red-700 font-bold transition-transform hover:scale-110"
                          >
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
    </div>
  );
}

export default ClassPage;
