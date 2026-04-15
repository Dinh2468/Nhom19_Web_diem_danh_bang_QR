import React, { useEffect, useState } from "react";
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
          headers: { Authorization: `Bearer ${token}` },
        });
        // Laravel trả về mảng trực tiếp hoặc bọc trong data
        const data = Array.isArray(response.data) ? response.data : response.data.data;
        setHistory(data || []);
      } catch (err) {
        setError("Không thể tải lịch sử điểm danh. Kiểm tra kết nối Backend.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchHistory();
  }, [token]);

  return (
    <div className="space-y-8 py-10 min-h-[70vh] bg-gray-50/30 px-4">
      {/* Header Section */}
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-indigo-600 font-bold">Cá nhân</p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">Lịch sử điểm danh</h1>
            <p className="mt-2 text-gray-500 text-sm">Xem lại toàn bộ quá trình tham gia lớp học của bạn.</p>
          </div>
          <div className="rounded-2xl bg-indigo-600 px-8 py-4 text-white shadow-lg">
            <p className="text-xs uppercase opacity-80 font-bold">Tổng lượt</p>
            <p className="text-3xl font-black">{history.length}</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
             <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-gray-400 font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-500 font-bold">{error}</div>
        ) : history.length === 0 ? (
          <div className="py-20 text-center text-gray-400 italic">Bạn chưa có lượt điểm danh nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
              <thead className="bg-gray-50/50 text-[10px] uppercase text-gray-400 font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4">Thời gian quét</th>
                  <th className="px-6 py-4">Môn học</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Vị trí (GPS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* NGÀY GIỜ: Lấy từ checkin_time của bảng attendance */}
                    <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">
                            {new Date(item.checkin_time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">
                            {new Date(item.checkin_time).toLocaleDateString('vi-VN')}
                        </p>
                    </td>

                    {/* MÔN HỌC: Truy xuất từ session -> course -> course_name */}
                    <td className="px-6 py-4">
                      <div className="font-black text-indigo-900 uppercase text-xs">
                          {item.session?.course?.course_name || "Môn học không xác định"}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 italic">
                          ID Buổi: #{item.session_id}
                      </div>
                    </td>

                    {/* TRẠNG THÁI: Có mặt hoặc Muộn */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-lg px-2 py-1 text-[10px] font-black uppercase border ${
                        item.status === "Có mặt" 
                        ? "bg-green-50 text-green-600 border-green-100" 
                        : "bg-yellow-50 text-yellow-600 border-yellow-100"
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    {/* GPS */}
                    <td className="px-6 py-4 text-[11px] font-mono text-gray-500">
                      {item.latitude && item.longitude
                        ? `${Number(item.latitude).toFixed(6)}, ${Number(item.longitude).toFixed(6)}`
                        : "N/A"}
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