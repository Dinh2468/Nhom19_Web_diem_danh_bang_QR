import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            STU ATTENDANCE SYSTEM
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Hệ Thống Điểm Danh
          </h1>
          <h2 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Bằng Mã QR
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Giải pháp quản lý hiệu điện tử minh, an toàn và chính xác điểm cho sinh viên. Chào mừng bạn đến với bảng điều kiện chính.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
          <Link
            to="/students"
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 text-center group cursor-pointer"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Sinh Viên</h3>
            <p className="text-gray-600 mb-6">
              Xem danh sách, chỉnh sửa hộ sơ và phân chia lớp học cho từng sinh viên trong hệ thống.
            </p>
            <span className="inline-flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
              Đi đến quản lý <span className="ml-2">→</span>
            </span>
          </Link>

          <Link
            to="/teachers"
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 text-center group cursor-pointer"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👨‍🏫</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Giáo Viên</h3>
            <p className="text-gray-600 mb-6">
              Quản lý thông tin giáo viên, cập nhật danh sách và phân công dạy học các ho chi tiết các khóa.
            </p>
            <span className="inline-flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
              Đi đến quản lý <span className="ml-2">→</span>
            </span>
          </Link>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center opacity-50 cursor-not-allowed">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Điểm Danh</h3>
            <p className="text-gray-600 mb-6">
              Quét mã QR giới hạn thời gian và thực để ghi nhận sự hiện diều của sinh viên trong các buổi học.
            </p>
            <span className="inline-flex items-center text-gray-400 font-semibold">Dang phát triển 🚀</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
