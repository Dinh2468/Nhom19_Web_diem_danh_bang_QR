import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="relative space-y-12 overflow-hidden py-10 min-h-[70vh] flex flex-col justify-center">
      {/* Khối màu loang làm nền mờ ảo đồng bộ phong cách */}
      <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
      <div className="absolute bottom-0 -right-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>

      {/* PHẦN HERO/TIÊU ĐỀ */}
      <div className="relative text-center max-w-3xl mx-auto">
        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
          STU Attendance System
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-6 mb-4 tracking-tight">
          Hệ Thống Điểm Danh <br />
          <span className="text-indigo-600">Bằng Mã QR</span>
        </h1>
        <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Giải pháp quản lý hiện diện thông minh, an toàn và chính xác dành cho
          sinh viên. Chào mừng bạn đến với bảng điều khiển chính.
        </p>
      </div>

      {/* KHU VỰC CÁC CHỨC NĂNG CHÍNH */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full px-4">
        {/* Card 1: Quản lý sinh viên */}
        <Link to="/students" className="group">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/30 hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-indigo-600 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sinh Viên</h3>
            <p className="text-sm text-gray-500 grow">
              Xem danh sách, chỉnh sửa hồ sơ và phân chia lớp học cho từng sinh
              viên trong hệ thống.
            </p>
            <div className="mt-5 flex items-center text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
              Đi đến quản lý
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </div>
        </Link>

        {/* Card 2: Điểm danh (Chờ phát triển) */}
        <div className="relative group cursor-not-allowed">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/30 flex flex-col h-full opacity-75">
            {/* Nhãn "Sắp ra mắt" */}
            <span className="absolute top-4 right-4 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">
              Mô đun QR
            </span>

            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m0 11v1m5-12h2a2 2 0 012 2v2m-2 4h2a2 2 0 012 2v2m-16-10h-2a2 2 0 00-2 2v2m2 4h-2a2 2 0 00-2 2v2m16-12V6a2 2 0 00-2-2h-2m-8 0H6a2 2 0 00-2 2v2m16 4h-2a2 2 0 01-2-2V6M6 20h2a2 2 0 002-2v-2m4 4h2a2 2 0 002-2v-2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Điểm Danh</h3>
            <p className="text-sm text-gray-400 grow">
              Quét mã QR giới hạn thời gian thực để ghi nhận sự hiện diện của
              sinh viên trong các buổi học.
            </p>
            <div className="mt-5 flex items-center text-sm font-semibold text-gray-400">
              Đang phát triển
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
