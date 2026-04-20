import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SUBJECT_API_URL = `${BASE_URL}/subjects`;

function SubjectPage() {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "69420", // Thêm dòng này
      },
    };
  };

  const fetchSubjects = useCallback(() => {
    setLoading(true);
    axios
      .get(SUBJECT_API_URL, getAuthHeader())
      .then((res) => {
        // Kiểm tra dữ liệu từ Đỉnh trả về
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setSubjects(data || []);
      })
      .catch((err) => console.error("Lỗi lấy môn học:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const addSubject = (e) => {
    e.preventDefault();
    // Đỉnh đặt tên cột là subject_name nên phải gửi đúng tên này
    axios
      .post(SUBJECT_API_URL, { subject_name: subjectName }, getAuthHeader())
      .then(() => {
        setSubjectName("");
        fetchSubjects();
        alert("Thêm môn học thành công!");
      })
      .catch((err) => console.error("Lỗi thêm:", err));
  };

  const updateSubject = (id) => {
    const sub = subjects.find((item) => item.id === id);
    axios
      .put(
        `${SUBJECT_API_URL}/${id}`,
        { subject_name: sub.subject_name },
        getAuthHeader(),
      )
      .then(() => {
        setEditingId(null);
        alert("Cập nhật thành công!");
        fetchSubjects();
      })
      .catch((err) => console.error("Lỗi cập nhật:", err));
  };

  const handleInputChange = (id, value) => {
    setSubjects(
      subjects.map((sub) =>
        sub.id === id ? { ...sub, subject_name: value } : sub,
      ),
    );
  };

  const deleteSubject = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa môn học này?")) {
      axios
        .delete(`${SUBJECT_API_URL}/${id}`, getAuthHeader())
        .then(() => fetchSubjects());
    }
  };

  return (
    <div className="relative space-y-8 py-4 px-4">
      {/* HEADER */}
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Quản lý Môn học
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Admin / Cập nhật từ danh mục của Đỉnh
        </p>
      </div>

      {/* FORM THÊM */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/30">
        <form
          onSubmit={addSubject}
          className="flex flex-col md:flex-row gap-4 items-end"
        >
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Tên môn học
            </label>
            <input
              placeholder="Ví dụ: Lập trình Web"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 outline-none text-sm"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl text-sm shadow-lg"
          >
            Thêm môn học
          </button>
        </form>
      </section>

      {/* BẢNG DANH SÁCH */}
      <div className="bg-white shadow-xl border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-bold">Mã Môn</th>
              <th className="px-6 py-4 font-bold">Tên môn học</th>
              <th className="px-6 py-4 font-bold text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-10">
                  Đang tải...
                </td>
              </tr>
            ) : (
              subjects.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-purple-50/30 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-purple-600">
                    {sub.subject_code || `#${sub.id}`}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === sub.id ? (
                      <input
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg outline-none text-sm"
                        value={sub.subject_name}
                        onChange={(e) =>
                          handleInputChange(sub.id, e.target.value)
                        }
                      />
                    ) : (
                      <span className="font-semibold text-gray-800">
                        {sub.subject_name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingId === sub.id ? (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => updateSubject(sub.id)}
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
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => setEditingId(sub.id)}
                          className="text-purple-600 font-bold"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteSubject(sub.id)}
                          className="text-red-500 font-bold"
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
  );
}

export default SubjectPage;
