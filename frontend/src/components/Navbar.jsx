import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Component con giữ hiệu ứng màu xanh
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md transition-all duration-200 font-bold ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const token =
    localStorage.getItem("user_token") || localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LOGO BÊN TRÁI */}
          <Link
            to={
              role === "teacher"
                ? "/teachers"
                : role === "student"
                  ? "/student-dashboard"
                  : "/home"
            }
            className="font-black text-xl text-blue-600 tracking-tighter"
          >
            STU ATTENDANCE
          </Link>

          {/* MENU TRUNG TÂM */}
          <div className="hidden sm:flex space-x-3 items-center">
            {/* 1. NẾU LÀ ADMIN: Hiện menu quản lý hệ thống */}
            {token && role === "admin" && (
              <div
                className="relative"
                onMouseEnter={() => setIsAdminOpen(true)}
                onMouseLeave={() => setIsAdminOpen(false)}
              >
                <button className="flex items-center px-4 py-2 rounded-md text-gray-600 font-bold hover:bg-gray-100 transition-all">
                  Quản Lý Hệ Thống
                </button>
                {isAdminOpen && (
                  <div className="absolute left-0 mt-1 w-56 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-50">
                    <Link
                      to="/admin/accounts"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      👥 Tài khoản
                    </Link>
                    <Link
                      to="/students"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      👨‍🎓 Sinh viên
                    </Link>
                    <Link
                      to="/teacher-admin"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      👩‍🏫 Giáo viên
                    </Link>
                    <Link
                      to="/classes"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      🏫 Lớp học
                    </Link>
                    <Link
                      to="/subjects"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      📚 Môn học
                    </Link>
                    <Link
                      to="/admin/courses"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      📚 Khóa học
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 2. NẾU LÀ SINH VIÊN: Hiện Trang chủ, Quét QR và Lịch sử */}
            {token && role === "student" && (
              <>
                <NavLink to="/student-dashboard">Trang Chủ</NavLink>
                <NavLink to="/scan">Quét QR</NavLink>
                <NavLink to="/attendance-history">Lịch sử</NavLink>
              </>
            )}

            {/* 3. NẾU LÀ GIẢNG VIÊN (VŨ): TRỐNG TRƠN (Đã xóa hết theo ý bạn) */}
            {/* Không thêm bất kỳ NavLink nào ở đây */}

            {/* PHẦN THÔNG TIN TÀI KHOẢN BÊN PHẢI */}
            {!token ? (
              <>
                {/* <NavLink to="/login">Đăng Nhập</NavLink> 
                <NavLink to="/register">Đăng Ký</NavLink>  */}
              </>
            ) : (
              <div className="flex items-center gap-4 ml-4 border-l pl-6 border-gray-200">
                <div className="flex flex-col items-end leading-tight">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {role === "teacher" ? "Giảng viên" : "Thành viên"}
                  </span>
                  <span className="text-sm font-black text-gray-900">
                    {user.name || "User"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-red-100"
                >
                  Thoát
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
