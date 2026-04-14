import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const COURSE_API_URL = `${BASE_URL}/courses`;
const SUBJECT_API_URL = `${BASE_URL}/subjects`;
const TEACHER_API_URL = `${BASE_URL}/teachers`;
const CLASS_API_URL = `${BASE_URL}/classes`;

function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  const [courseName, setCourseName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [classId, setClassId] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 1. Lấy danh sách Khóa học
  const fetchCourses = useCallback(() => {
    setLoading(true);
    axios.get(COURSE_API_URL, { headers: getAuthHeader() })
      .then((res) => {
        const data = res.data.data || res.data;
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Lỗi khóa học:", err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Lấy dữ liệu bổ trợ (Sửa logic đổ dữ liệu ở đây)
  useEffect(() => {
    const headers = { headers: getAuthHeader() };

    // Tải Môn học
    axios.get(SUBJECT_API_URL, headers)
      .then(res => {
        const data = res.data.data || res.data || [];
        setSubjects(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Lỗi môn học:", err));

    // Tải Giảng viên - Đảm bảo lọc đúng mảng data
    axios.get(TEACHER_API_URL, headers)
      .then(res => {
        const data = res.data.data || res.data || [];
        console.log("Dữ liệu GV nhận được:", data);
        setTeachers(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Lỗi giảng viên:", err);
        setTeachers([]);
      });

    // Tải Lớp
    axios.get(CLASS_API_URL, headers)
      .then(res => {
        const data = res.data.data || res.data || [];
        setClasses(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Lỗi lớp:", err));

    fetchCourses();
  }, [fetchCourses]);

  // 3. Thêm mới khóa học
  const addCourse = (e) => {
    e.preventDefault();
    if (!subjectId || !teacherId || !classId) {
      alert("Vui lòng chọn đầy đủ các trường!");
      return;
    }
    axios.post(COURSE_API_URL, {
      course_name: courseName,
      subject_id: parseInt(subjectId),
      teacher_id: parseInt(teacherId),
      class_id: parseInt(classId)
    }, { headers: getAuthHeader() })
      .then(() => {
        setCourseName(""); setSubjectId(""); setTeacherId(""); setClassId("");
        fetchCourses();
        alert("Thêm thành công!");
      })
      .catch(() => alert("Lỗi khi thêm!"));
  };

  // 4. Cập nhật khóa học
  const updateCourse = (id) => {
    const item = courses.find(c => c.id === id);
    axios.put(`${COURSE_API_URL}/${id}`, {
      course_name: item.course_name,
      subject_id: parseInt(item.subject_id),
      teacher_id: parseInt(item.teacher_id),
      class_id: parseInt(item.class_id)
    }, { headers: getAuthHeader() })
      .then(() => {
        setEditingId(null);
        fetchCourses();
        alert("Cập nhật thành công!");
      })
      .catch(() => alert("Lỗi cập nhật!"));
  };

  const handleInputChange = (id, field, value) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // 5. Xóa khóa học
  const deleteCourse = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      axios.delete(`${COURSE_API_URL}/${id}`, { headers: getAuthHeader() })
        .then(() => { fetchCourses(); alert("Đã xóa!"); })
        .catch(() => alert("Xóa thất bại!"));
    }
  };

  return (
    <div className="relative space-y-8 py-4 px-2">
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-3xl font-extrabold text-gray-900">Quản lý Khóa học</h2>
      </div>

      {/* FORM THÊM MỚI */}
      <section className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-gray-100 shadow-xl">
        <form onSubmit={addCourse} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Tên học phần</label>
            <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={courseName} onChange={e => setCourseName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Môn học</label>
            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={subjectId} onChange={e => setSubjectId(e.target.value)} required>
              <option value="">-- Chọn môn --</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Giảng viên</label>
            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={teacherId} onChange={e => setTeacherId(e.target.value)} required>
              <option value="">-- Chọn GV --</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Lớp</label>
            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={classId} onChange={e => setClassId(e.target.value)} required>
              <option value="">-- Chọn lớp --</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg">Thêm</button>
          </div>
        </form>
      </section>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold border-b">
            <tr>
              <th className="px-6 py-5">Tên học phần</th>
              <th className="px-6 py-5">Môn học</th>
              <th className="px-6 py-5">Giảng viên</th>
              <th className="px-6 py-5">Lớp</th>
              <th className="px-6 py-5 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {courses.length > 0 ? (
              courses.map(course => (
                <tr key={course.id}>
                  <td className="px-6 py-5 font-semibold">
                    {editingId === course.id ? (
                      <input className="border rounded px-2" value={course.course_name} onChange={e => handleInputChange(course.id, "course_name", e.target.value)} />
                    ) : course.course_name}
                  </td>
                  <td className="px-6 py-5">{course.subject_name || "N/A"}</td>
                  <td className="px-6 py-5">{course.full_name || "N/A"}</td>
                  <td className="px-6 py-5">{course.class_name || "N/A"}</td>
                  <td className="px-6 py-5 text-center">
                    {editingId === course.id ? (
                      <button onClick={() => updateCourse(course.id)} className="text-green-600 mr-2">Lưu</button>
                    ) : (
                      <button onClick={() => setEditingId(course.id)} className="text-purple-600 mr-4">Sửa</button>
                    )}
                    <button onClick={() => deleteCourse(course.id)} className="text-red-500">Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="px-6 py-10 text-center">Chưa có dữ liệu...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CoursePage;