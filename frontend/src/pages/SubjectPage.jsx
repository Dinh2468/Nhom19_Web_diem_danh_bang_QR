import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SUBJECT_API_URL = `${BASE_URL}/subjects`;

function SubjectPage() {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState(""); // Thêm state cho Mã môn học
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchSubjects = useCallback(() => {
    setLoading(true);
    axios
      .get(SUBJECT_API_URL, getAuthHeader())
      .then((res) => {
        const data = res.data.success ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        setSubjects(data);
      })
      .catch((err) => console.error("Lỗi lấy môn học:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // --- SỬA HÀM THÊM: Gửi cả Mã và Tên ---
  const addSubject = (e) => {
    e.preventDefault();
    const newSubject = { 
        subject_code: subjectCode, 
        subject_name: subjectName 
    };

    axios
      .post(SUBJECT_API_URL, newSubject, getAuthHeader())
      .then((res) => {
        if (res.data.success) {
          setSubjectName("");
          setSubjectCode("");
          fetchSubjects();
          alert("Thêm môn học thành công!");
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Lỗi: Mã môn học đã tồn tại!";
        alert(msg);
      });
  };

  const updateSubject = (id) => {
    const sub = subjects.find((item) => item.id === id);
    axios
      .put(`${SUBJECT_API_URL}/${id}`, { 
        subject_code: sub.subject_code,
        subject_name: sub.subject_name 
      }, getAuthHeader())
      .then((res) => {
        if (res.data.success) {
          setEditingId(null);
          alert("Cập nhật thành công!");
          fetchSubjects();
        }
      })
      .catch((err) => console.error("Lỗi cập nhật:", err));
  };

  const handleInputChange = (id, field, value) => {
    setSubjects(
      subjects.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub))
    );
  };

  // --- SỬA HÀM XÓA: Kiểm tra phản hồi success ---
  const deleteSubject = (id) => {
    if (window.confirm("Vũ có chắc chắn muốn xóa môn học này?")) {
      axios.delete(`${SUBJECT_API_URL}/${id}`, getAuthHeader())
        .then((res) => {
          if (res.data.success) {
            alert("Xóa thành công!");
            fetchSubjects();
          } else {
            alert("Lỗi: " + res.data.message);
          }
        })
        .catch(err => {
            const msg = err.response?.data?.message || "Không thể xóa môn học này!";
            alert(msg);
        });
    }
  };

  return (
    <div className="relative space-y-8 py-4 px-4">
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-3xl font-extrabold text-gray-900">Quản lý Môn học</h2>
        <p className="text-sm text-gray-500 mt-1">Hệ thống quản lý STU</p>
      </div>

      {/* FORM THÊM MỚI */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/30">
        <form onSubmit={addSubject} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Mã môn học</label>
            <input
              placeholder="Ví dụ: IT001"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-purple-500"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Tên môn học</label>
            <input
              placeholder="Ví dụ: Lập trình Web"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-purple-500"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold h-[46px] rounded-xl text-sm transition-all shadow-lg shadow-purple-200">
            Thêm môn học
          </button>
        </form>
      </section>

      {/* DANH SÁCH */}
      <div className="bg-white shadow-xl border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-4">Mã Môn</th>
              <th className="px-6 py-4">Tên môn học</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="3" className="text-center py-10">Đang đồng bộ dữ liệu...</td></tr>
            ) : subjects.map((sub) => (
              <tr key={sub.id} className="hover:bg-purple-50/30 transition-colors">
                <td className="px-6 py-4">
                    {editingId === sub.id ? (
                        <input 
                            className="border border-purple-300 rounded px-2 py-1 w-full"
                            value={sub.subject_code}
                            onChange={(e) => handleInputChange(sub.id, "subject_code", e.target.value)}
                        />
                    ) : (
                        <span className="font-bold text-purple-600">{sub.subject_code}</span>
                    )}
                </td>
                <td className="px-6 py-4">
                  {editingId === sub.id ? (
                    <input
                      className="w-full px-3 py-1 border border-purple-300 rounded-lg outline-none"
                      value={sub.subject_name}
                      onChange={(e) => handleInputChange(sub.id, "subject_name", e.target.value)}
                    />
                  ) : (
                    <span className="font-semibold text-gray-800">{sub.subject_name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-4">
                    {editingId === sub.id ? (
                      <button onClick={() => updateSubject(sub.id)} className="text-green-600 font-bold">Lưu</button>
                    ) : (
                      <button onClick={() => setEditingId(sub.id)} className="text-purple-600 font-bold">Sửa</button>
                    )}
                    <button onClick={() => deleteSubject(sub.id)} className="text-red-500 font-bold">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubjectPage;