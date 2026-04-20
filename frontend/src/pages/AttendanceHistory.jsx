import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://asyllabic-emelina-uncheated.ngrok-free.dev/api";

function AttendanceHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token =
    localStorage.getItem("token") || localStorage.getItem("user_token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/attendance/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
            // THÊM DÒNG NÀY ĐỂ HẾT LỖI ĐỎ 200 (OK)
            "ngrok-skip-browser-warning": "69420",
            Accept: "application/json",
          },
        });
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        setHistory(data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Không thể tải lịch sử điểm danh. Kiểm tra API hoặc quyền truy cập.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  return (
    <div className="space-y-8 py-10 min-h-[70vh]">
      <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-xl shadow-gray-200/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600 font-bold">
              Lịch sử điểm danh
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">
              Danh sách điểm danh cá nhân
            </h1>
            <p className="mt-4 max-w-2xl text-gray-500 leading-relaxed">
              Hiển thị tất cả lượt điểm danh bạn đã quét. Mỗi bản ghi bao gồm
              thời gian, môn học, trạng thái và vị trí GPS.
            </p>
          </div>
          <div className="rounded-3xl bg-indigo-600 px-6 py-5 text-white shadow-lg shadow-indigo-200/30">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-100">
              Bản ghi
            </p>
            <p className="mt-3 text-3xl font-black">{history.length}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-gray-500">
            Đang tải lịch sử điểm danh...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            Bạn chưa có lượt điểm danh nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wide">
                <tr>
                  <th className="px-4 py-3">Ngày giờ</th>
                  <th className="px-4 py-3">Môn học / QR</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Vị trí</th>
                  <th className="px-4 py-3">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                      {/* Hiển thị thời gian check-in tiếng Việt */}
                      {item.checkin_time
                        ? new Date(item.checkin_time).toLocaleString("vi-VN")
                        : "-"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-indigo-600">
                        {/* Lấy tên môn học từ quan hệ session -> course */}
                        {item.session?.course?.course_name || "Môn học"}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Phòng: {item.session?.room || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          item.status === "Có mặt"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {item.latitude && item.longitude
                        ? `${Number(item.latitude).toFixed(6)}, ${Number(item.longitude).toFixed(6)}`
                        : "Chưa có GPS"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">-</td>
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
