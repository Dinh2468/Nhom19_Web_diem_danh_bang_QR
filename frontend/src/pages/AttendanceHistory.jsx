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
          headers: { Authorization: `Bearer ${token}` },
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
                  <tr key={item.id || item.datetime || item.qr_data}>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                      {item.datetime || item.created_at || "-"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold">
                        {item.subject_name || item.qr_data || "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.qr_data
                          ? item.qr_data.slice(0, 35) +
                            (item.qr_data.length > 35 ? "..." : "")
                          : "-"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.status === "present" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {item.status || item.attendance_status || "Đã ghi"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {item.latitude && item.longitude
                        ? `${item.latitude.toFixed(6)}, ${item.longitude.toFixed(6)}`
                        : "Chưa có GPS"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {item.note || item.remark || "-"}
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
