import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Class_API_URL = `${BASE_URL}/class-sessions`;
const ATTENDANCE_API_URL = `${BASE_URL}/attendance`;

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSession, setNewSession] = useState({
    session_date: "",
    start_time: "",
    end_time: "",
    room: "",
  });

  const token =
    localStorage.getItem("token") || localStorage.getItem("user_token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420",
    },
  };

  const fetchSessions = async (courseId) => {
    if (!courseId) return setSessions([]);
    try {
      const res = await axios.get(
        `${Class_API_URL}?course_id=${courseId}`,
        axiosConfig,
      );
      setSessions(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/courses`, axiosConfig);
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setCourses(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchCourses();
  }, [token]);

  useEffect(() => {
    fetchSessions(selectedCourse);
  }, [selectedCourse]);

  // 1. Polling Realtime SV
  // TeacherDashboard.jsx

  useEffect(() => {
    let interval;
    if (isSessionActive && selectedSession) {
      const fetchAttendanceRealtime = async () => {
        try {
          // Đảm bảo URL này khớp với route bạn khai báo trong api.php của Laravel
          const res = await axios.get(
            `${BASE_URL}/attendance/session/${selectedSession}`,
            axiosConfig,
          );
          // Cập nhật dữ liệu từ res.data (Laravel thường trả trực tiếp mảng nếu bạn dùng return response()->json($data))
          setAttendanceList(res.data || []);
        } catch (err) {
          console.error("Lỗi lấy danh sách Realtime:", err);
        }
      };

      fetchAttendanceRealtime();
      interval = setInterval(fetchAttendanceRealtime, 3000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, selectedSession]);

  // 2. Token QR Động
  useEffect(() => {
    let qrInterval;
    const fetchNewQRToken = async () => {
      try {
        const res = await axios.get(
          `${ATTENDANCE_API_URL}/generate-token/${selectedSession}`,
          axiosConfig,
        );
        setQrCodeData(`${selectedSession}-${res.data.qr_token}`);
      } catch (err) {
        console.error("Lỗi refresh QR");
      }
    };

    if (isSessionActive && selectedSession) {
      qrInterval = setInterval(fetchNewQRToken, 60000); // Refresh QR mỗi 60s để tránh bị lộ mã lâu và tăng bảo mật
    }
    return () => clearInterval(qrInterval);
  }, [isSessionActive, selectedSession]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      // Lấy thông tin user từ localStorage (giả sử bạn lưu object user có chứa id)
      const user = JSON.parse(localStorage.getItem("user"));
      const teacherId = user?.id; // Lấy ID của giảng viên đang đăng nhập

      await axios.post(
        Class_API_URL,
        {
          course_id: selectedCourse,
          teacher_id: teacherId, // THÊM DÒNG NÀY ĐỂ GỬI LÊN BACKEND
          ...newSession,
        },
        axiosConfig,
      );

      alert("✅ Đã tạo buổi học thành công!");
      setShowCreateForm(false);
      setNewSession({
        session_date: "",
        start_time: "",
        end_time: "",
        room: "",
      });
      fetchSessions(selectedCourse);
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi tạo buổi học!");
    }
  };

  const handleStart = async () => {
    if (!selectedSession)
      return alert("Vui lòng chọn cụ thể buổi học hôm nay!");
    try {
      const res = await axios.get(
        `${ATTENDANCE_API_URL}/generate-token/${selectedSession}`,
        axiosConfig,
      );
      setQrCodeData(`${selectedSession}-${res.data.qr_token}`);
      setStartTime(new Date().toLocaleTimeString("vi-VN"));
      setEndTime(null);
      setIsSessionActive(true);
    } catch (err) {
      alert("Lỗi lấy mã QR từ Server!");
    }
  };

  const handleEnd = () => {
    if (window.confirm("Bạn có chắc muốn kết thúc điểm danh và chốt sổ?")) {
      setEndTime(new Date().toLocaleTimeString("vi-VN"));
      setIsSessionActive(false);
      setQrCodeData("");
    }
  };

  const handleExportExcel = () => {
    if (selectedSession) {
      // Gọi thẳng đến endpoint mà không cần Header Auth
      const exportUrl = `${BASE_URL}/export/${selectedSession}`;
      window.open(exportUrl, "_blank");
    } else {
      alert("Vui lòng chọn một buổi học để xuất dữ liệu!");
    }
  };

  // --- CỤM TÍNH TOÁN AN TOÀN ---
  const safeList = Array.isArray(attendanceList) ? attendanceList : [];
  const totalStudents = safeList.length;
  const presentCount = safeList.filter((s) => s.status === "Có mặt").length;
  const lateCount = safeList.filter((s) => s.status === "Muộn").length;
  const absentCount = safeList.filter((s) => s.status === null).length;
  const scannedCount = presentCount + lateCount;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            📅 Thiết lập tiết dạy
          </h2>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                1. Chọn lớp học phần
              </label>
              <select
                className="w-full mt-2 p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-gray-700 outline-none"
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedSession("");
                  setShowCreateForm(false);
                }}
                disabled={isSessionActive}
              >
                <option value="">-- Danh sách Lớp --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.course_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  2. Chọn buổi học
                </label>
                {selectedCourse && !isSessionActive && (
                  <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100 transition-colors"
                  >
                    {showCreateForm ? "Hủy tạo" : "+ Tạo buổi mới"}
                  </button>
                )}
              </div>
              <select
                className="w-full mt-2 p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-gray-700 disabled:opacity-50 outline-none"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                disabled={isSessionActive || !selectedCourse || showCreateForm}
              >
                <option value="">-- Chọn buổi học hôm nay --</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    Ngày {s.session_date} ({s.start_time.substring(0, 5)}) -{" "}
                    {s.room}
                  </option>
                ))}
              </select>
            </div>

            {showCreateForm && (
              <form
                onSubmit={handleCreateSession}
                className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-3"
              >
                <h3 className="text-xs font-bold text-indigo-800 uppercase text-center mb-2">
                  Thêm Buổi Học Mới
                </h3>
                <div>
                  <label className="text-[10px] text-gray-500 font-bold">
                    Ngày học:
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full text-sm p-2 rounded-lg border outline-none"
                    value={newSession.session_date}
                    onChange={(e) =>
                      setNewSession({
                        ...newSession,
                        session_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold">
                      Giờ bắt đầu:
                    </label>
                    <input
                      type="time"
                      required
                      className="w-full text-sm p-2 rounded-lg border outline-none"
                      value={newSession.start_time}
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          start_time: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold">
                      Giờ kết thúc:
                    </label>
                    <input
                      type="time"
                      required
                      className="w-full text-sm p-2 rounded-lg border outline-none"
                      value={newSession.end_time}
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          end_time: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-bold">
                    Phòng học:
                  </label>
                  <input
                    type="text"
                    placeholder="VD: C102"
                    className="w-full text-sm p-2 rounded-lg border outline-none"
                    value={newSession.room}
                    onChange={(e) =>
                      setNewSession({ ...newSession, room: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-indigo-700"
                >
                  Lưu buổi học
                </button>
              </form>
            )}

            {!isSessionActive ? (
              <button
                onClick={handleStart}
                disabled={!selectedSession || showCreateForm}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                BẮT ĐẦU ĐIỂM DANH
              </button>
            ) : (
              <button
                onClick={handleEnd}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg hover:bg-red-600 transition-all"
              >
                KẾT THÚC ĐIỂM DANH
              </button>
            )}

            <div className="mt-4 p-4 bg-indigo-50/30 rounded-2xl text-[11px] space-y-3 font-bold text-gray-600 border border-indigo-50">
              <p className="flex justify-between items-center">
                Tổng sĩ số:{" "}
                <span className="bg-white border px-2 py-1 rounded-lg text-gray-800">
                  {totalStudents} SV
                </span>
              </p>
              <p className="flex justify-between items-center">
                Đã quét QR:{" "}
                <span className="bg-green-50 border border-green-100 px-2 py-1 rounded-lg text-green-600">
                  {scannedCount} SV
                </span>
              </p>
              <p className="flex justify-between items-center">
                Đi muộn:{" "}
                <span className="bg-yellow-50 border border-yellow-100 px-2 py-1 rounded-lg text-yellow-600">
                  {lateCount} SV
                </span>
              </p>
              <p className="flex justify-between items-center">
                Chưa quét (Vắng):{" "}
                <span className="bg-red-50 border border-red-100 px-2 py-1 rounded-lg text-red-500">
                  {absentCount} SV
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {isSessionActive || endTime ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col justify-center">
                {isSessionActive ? (
                  <>
                    <span className="text-[10px] font-black text-indigo-600 mb-4 uppercase bg-indigo-50 px-3 py-1 rounded-full w-fit mx-auto">
                      Vui lòng quét mã bên dưới
                    </span>
                    <div className="p-4 bg-white border-2 border-dashed border-indigo-100 rounded-3xl inline-block shadow-inner ">
                      {qrCodeData && (
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrCodeData}`}
                          alt="QR Code"
                          className="mx-auto"
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-20 text-gray-400">
                    <span className="text-6xl mb-4 block">✅</span>
                    <p className="font-bold text-xs uppercase tracking-widest">
                      Đã chốt sổ điểm danh
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[520px]">
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <span className="font-bold text-gray-700 text-xs uppercase tracking-wider">
                    {isSessionActive
                      ? "🟢 Đang điểm danh (Realtime)"
                      : "📋 Bảng tổng kết chốt sổ"}
                  </span>
                  {selectedSession && (
                    <button
                      onClick={handleExportExcel}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-[10px] font-bold hover:bg-green-700 transition-all shadow-sm"
                    >
                      <span>📊</span> Xuất Excel
                    </button>
                  )}
                </div>
                <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                  {safeList.map((item, idx) => {
                    const isAttended = item.status !== null;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-2xl mb-3 border ${isAttended ? "bg-white shadow-sm" : "bg-red-50/10 border-red-100"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white ${isAttended ? "bg-indigo-600" : "bg-red-500"}`}
                          >
                            {item.full_name ? item.full_name.charAt(0) : "?"}
                          </div>
                          <div>
                            <p
                              className={`text-sm font-bold ${isAttended ? "text-gray-800" : "text-red-700"}`}
                            >
                              {item.full_name}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium">
                              {item.student_code}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {isAttended ? (
                            <span
                              className={`text-[8px] font-black px-2 py-0.5 rounded-lg border ${item.status === "Có mặt" ? "bg-green-50 text-green-600 border-green-100" : "bg-yellow-50 text-yellow-600 border-yellow-100"}`}
                            >
                              {item.status.toUpperCase()}
                            </span>
                          ) : (
                            <span className="text-[8px] font-black px-2 py-0.5 rounded-lg bg-red-100 text-red-600 border border-red-200">
                              VẮNG MẶT
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
              <span className="text-5xl mb-4 animate-bounce">⏳</span>
              <p className="font-bold uppercase text-xs text-gray-500">
                Sẵn sàng điểm danh
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
