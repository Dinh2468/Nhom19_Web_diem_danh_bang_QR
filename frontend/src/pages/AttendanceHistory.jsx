import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

function AttendanceHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || localStorage.getItem("user_token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/attendance/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Backend trả về mảng trực tiếp từ Query Builder/Eloquent
        const data = Array.isArray(response.data) ? response.data : response.data.data;
        setHistory(data || []);
      } catch (err) {
        console.error("Lỗi tải lịch sử:", err);
        setError("Không thể lấy dữ liệu lịch sử điểm danh. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchHistory();
    } else {
      setError("Vui lòng đăng nhập để xem lịch sử.");
      setLoading(false);
    }
  }, [token]);

  // Hàm format trạng thái điểm danh ra giao diện (Màu sắc)
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "có mặt":
        return (
          <span className="px-3 py-1 text-xs font-black bg-green-100 text-green-700 rounded-full border border-green-200">
            CÓ MẶT
          </span>
        );
      case "muộn":
        return (
          <span className="px-3 py-1 text-xs font-black bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200">
            MUỘN
          </span>
        );
      case "vắng mặt":
        return (
          <span className="px-3 py-1 text-xs font-black bg-red-100 text-red-700 rounded-full border border-red-200">
            VẮNG
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-black bg-gray-100 text-gray-700 rounded-full border border-gray-200">
            {status?.toUpperCase() || "KHÔNG RÕ"}
          </span>
        );
    }
  };

  // Hàm hiển thị thời gian chuẩn định dạng Việt Nam
  const formatDateTime = (dateString) => {
    if (!dateString) return "--:--";
    const date = new Date(dateString);
    return date.toLocaletoLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-8 py-10 min-h-[70vh] max-w-6xl mx-auto px-4">
      {/* Header Lịch sử */}
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/40">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600 font-bold">Sinh viên</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Lịch sử điểm danh</h1>
            <p className="mt-3 text-gray-500 leading-relaxed">
              Theo dõi chi tiết thời gian và trạng thái điểm danh các môn học của bạn trong học kỳ.
            </p>
          </div>
          <div className="rounded-3xl bg-indigo-50 px-6 py-5 text-indigo-900 border border-indigo-100 shadow-sm text-center">
            <p className="text-xs uppercase tracking-[0.2em] font-bold opacity-80">Tổng số buổi đã học</p>
            <p className="mt-2 text-4xl font-black">{loading ? "-" : history.length}</p>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-semibold animate-pulse">Đang tải dữ liệu lịch sử...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500 font-semibold bg-red-50/50">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <span className="text-5xl mb-4">📭</span>
            <p className="font-semibold">Bạn chưa có dữ liệu điểm danh nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="p-5 font-bold text-xs text-gray-500 uppercase tracking-widest">STT</th>
                  <th className="p-5 font-bold text-xs text-gray-500 uppercase tracking-widest">Khóa học / Lớp</th>
                  <th className="p-5 font-bold text-xs text-gray-500 uppercase tracking-widest">Thời gian quét QR</th>
                  <th className="p-5 font-bold text-xs text-gray-500 uppercase tracking-widest text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.map((record, index) => (
                  <tr 
                    key={record.id} 
                    className="hover:bg-indigo-50/30 transition-colors duration-200 group"
                  >
                    <td className="p-5 font-bold text-gray-400">
                      #{index + 1}
                    </td>
                    <td className="p-5">
                      <p className="font-bold text-gray-900 text-sm">
                        {/* Hiển thị tên môn học từ Relationship session.course hoặc session.subject */}
                        {record.session?.course?.course_name || record.session?.subject?.subject_name || "Chưa cập nhật tên môn"}
                      </p>
                      <p className="text-xs text-gray-400 font-medium mt-1">
                        Buổi học ID: {record.session_id}
                      </p>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-sm text-gray-700">
                          {formatDateTime(record.checkin_time)}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      {getStatusBadge(record.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceHistory;