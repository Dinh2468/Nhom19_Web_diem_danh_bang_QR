import React from "react";
import { Link } from "react-router-dom";

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="space-y-8 py-10 min-h-[70vh]">
      <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-xl shadow-gray-200/40">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600 font-bold">
              Trang sinh viên
            </p>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-3">
              Xin chào, {user.name || "Sinh viên"}
            </h1>
            <p className="mt-4 text-gray-500 max-w-2xl leading-relaxed">
              Đây là trang điều khiển sinh viên. Bạn có thể quét mã QR để điểm
              danh, xem lịch sử điểm danh cá nhân và theo dõi thông tin hồ sơ.
            </p>
          </div>
          <div className="rounded-3xl bg-indigo-600 px-6 py-5 text-white shadow-lg shadow-indigo-200/30">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-100">
              Quyền
            </p>
            <p className="mt-2 text-3xl font-black">{user.role || "student"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Thông tin cá nhân
          </h2>
          <div className="mt-6 space-y-4 text-sm text-gray-600">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Họ tên
              </div>
              <div className="mt-2 font-bold text-gray-900">
                {user.name || "Chưa có"}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Email
              </div>
              <div className="mt-2 font-bold text-gray-900">
                {user.email || "Chưa có"}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Mã sinh viên
              </div>
              <div className="mt-2 font-bold text-gray-900">
                {user.student_code || user.login_id || "Chưa có"}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Điểm danh QR</h2>
          <p className="mt-4 text-gray-500 leading-relaxed">
            Tích hợp camera quét mã QR và gửi kèm tọa độ GPS từ trình duyệt.
            Chọn chức năng bên dưới để điểm danh và xem lịch sử.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              to="/scan"
              className="rounded-3xl bg-indigo-600 px-5 py-4 text-center text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Quét QR điểm danh
            </Link>
            <Link
              to="/attendance-history"
              className="rounded-3xl border border-gray-200 bg-white px-5 py-4 text-center text-sm font-bold text-gray-900 transition hover:border-indigo-200 hover:text-indigo-700"
            >
              Xem lịch sử điểm danh
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            Hướng dẫn nhanh
          </h3>
          <ol className="mt-4 space-y-3 text-sm text-gray-600 list-decimal list-inside">
            <li>Đăng nhập tài khoản sinh viên.</li>
            <li>Vào trang "Quét QR điểm danh" và cho phép camera.</li>
            <li>Đợi hệ thống giải mã QR và gửi thông tin lên API cùng GPS.</li>
            <li>Xem lại lịch sử điểm danh tại trang lịch sử.</li>
          </ol>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            Tình trạng hiện tại
          </h3>
          <div className="mt-6 space-y-4 text-sm text-gray-600">
            <div className="rounded-3xl bg-gray-50 p-4">
              <p className="font-semibold text-gray-900">Camera</p>
              <p className="mt-2">
                Sử dụng trực tiếp để quét mã QR và giải mã nhanh.
              </p>
            </div>
            <div className="rounded-3xl bg-gray-50 p-4">
              <p className="font-semibold text-gray-900">GPS</p>
              <p className="mt-2">
                Tự động lấy tọa độ trình duyệt khi gửi điểm danh.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Mẹo</h3>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li>Đảm bảo cấp quyền camera và vị trí.</li>
            <li>Nếu không quét được, thử xoay mã QR hoặc tăng ánh sáng.</li>
            <li>
              Có thể dán nội dung QR thủ công nếu camera không tương thích.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
