import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STUDENT_API_URL = `${BASE_URL}/students`; 
const CLASS_API_URL = `${BASE_URL}/classes`;

function Student() {
  const [students, setStudents] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(STUDENT_API_URL, { headers: getAuthHeader() });
      if (res.data && res.data.success) {
        setStudents(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    axios.get(CLASS_API_URL, { headers: getAuthHeader() })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setClasses(data || []);
      })
      .catch((err) => console.error("Lỗi lấy danh sách lớp:", err));
  }, [fetchStudents]);

  const addStudent = (e) => {
    e.preventDefault();
    if (!classId) return alert("Vui lòng chọn lớp học!");

    const newStudent = {
      student_code: studentCode,
      full_name: fullName,
      email: email,
      class_id: parseInt(classId)
    };

    axios.post(STUDENT_API_URL, newStudent, { headers: getAuthHeader() })
      .then((res) => {
        if (res.data.success) {
          setFullName(""); setEmail(""); setStudentCode(""); setClassId("");
          fetchStudents();
          alert("Thêm sinh viên thành công!");
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Mã SV/Email đã tồn tại!";
        alert("Lỗi: " + msg);
      });
  };

  const updateStudent = (id) => {
    const sv = students.find((item) => item.id === id);
    axios.put(`${STUDENT_API_URL}/${id}`, {
      full_name: sv.full_name,
      email: sv.email,
      class_id: parseInt(sv.class_id),
      student_code: sv.student_code
    }, { headers: getAuthHeader() })
      .then(() => {
        setEditingId(null);
        alert("Cập nhật thành công!");
        fetchStudents();
      })
      .catch((err) => console.error("Lỗi cập nhật:", err));
  };

  const handleInputChange = (id, field, value) => {
    setStudents(prev => prev.map((sv) => (sv.id === id ? { ...sv, [field]: value } : sv)));
  };

  // --- HÀM XÓA ĐÃ CẢI TIẾN ---
  const deleteStudent = (id) => {
    if (window.confirm("Vũ có chắc chắn muốn xóa sinh viên này không?")) {
      axios.delete(`${STUDENT_API_URL}/${id}`, { headers: getAuthHeader() })
        .then((res) => {
          if (res.data.success) {
            alert("Xóa thành công!");
            fetchStudents(); // Cập nhật lại danh sách ngay lập tức
          } else {
            alert("Không thể xóa: " + res.data.message);
          }
        })
        .catch(err => {
          console.error("Lỗi xóa:", err);
          const errorMsg = err.response?.data?.message || "Lỗi server hoặc lỗi kết nối!";
          alert("Lỗi: " + errorMsg);
        });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">HỆ THỐNG SINH VIÊN</h2>
          <p className="text-gray-500 text-sm mt-1">Quản lý danh sách và phân lớp học sinh</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
           <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-indigo-700 font-medium text-sm">Máy chủ đang chạy</span>
        </div>
      </div>

      {/* FORM THÊM MỚI */}
      <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xl shadow-indigo-100/50">
        <h3 className="text-lg font-bold text-gray-700 mb-5 flex items-center gap-2">
          <span className="bg-indigo-600 w-2 h-6 rounded-full inline-block"></span>
          Thêm Sinh Viên Mới
        </h3>
        <form onSubmit={addStudent} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input placeholder="Mã SV" className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" value={studentCode} onChange={(e) => setStudentCode(e.target.value)} required />
          <input placeholder="Họ tên" className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <input placeholder="Email" type="email" className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <select className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" value={classId} onChange={(e) => setClassId(e.target.value)} required>
            <option value="">-- Chọn lớp --</option>
            {classes.map((cls) => (<option key={cls.id} value={cls.id}>{cls.class_name}</option>))}
          </select>
          <button type="submit" className="bg-indigo-600 text-white py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all">Thêm mới</button>
        </form>
      </section>

      {/* BẢNG DANH SÁCH */}
      <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="px-6 py-5 text-gray-700 font-bold uppercase text-xs">Mã SV</th>
              <th className="px-6 py-5 text-gray-700 font-bold uppercase text-xs">Họ và Tên</th>
              <th className="px-6 py-5 text-gray-700 font-bold uppercase text-xs">Email</th>
              <th className="px-6 py-5 text-gray-700 font-bold uppercase text-xs">Lớp</th>
              <th className="px-6 py-5 text-gray-700 font-bold uppercase text-xs text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-20 font-medium text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : students.map((sv) => (
              <tr key={sv.id} className="hover:bg-indigo-50/20 transition-colors">
                <td className="px-6 py-4 font-mono text-indigo-600 font-bold">{sv.student_code}</td>
                <td className="px-6 py-4">
                  {editingId === sv.id ? <input className="border-b-2 border-indigo-500 outline-none w-full" value={sv.full_name} onChange={(e) => handleInputChange(sv.id, "full_name", e.target.value)} /> : <span className="font-semibold">{sv.full_name}</span>}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {editingId === sv.id ? <input className="border-b-2 border-indigo-500 outline-none w-full" value={sv.email} onChange={(e) => handleInputChange(sv.id, "email", e.target.value)} /> : sv.email}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-xl text-xs font-black border border-indigo-200">
                    {sv.classroom?.class_name || "Chưa xếp lớp"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    {editingId === sv.id ? (
                      <button onClick={() => updateStudent(sv.id)} className="text-green-600 font-bold">Lưu</button>
                    ) : (
                      <button onClick={() => setEditingId(sv.id)} className="text-indigo-600 font-bold">Sửa</button>
                    )}
                    <button onClick={() => deleteStudent(sv.id)} className="text-red-500 font-bold hover:scale-110 transition-transform">Xóa</button>
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

export default Student;