import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate, // Thêm useNavigate để chuyển hướng sau khi logout
} from "react-router-dom";
import HomePage from "./pages/Home";
import StudentPage from "./pages/Student";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md transition-colors duration-200 ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
      }`}
    >
      {children}
    </Link>
  );
};

// Tạo một component riêng cho Navbar để dùng được hook useNavigate
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Xóa dữ liệu đăng nhập trong LocalStorage (nếu có)
    localStorage.removeItem("user_token"); 
    
    alert("Bạn đã đăng xuất thành công!");
    
    // 2. Chuyển hướng người dùng về trang Đăng nhập
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="font-bold text-lg text-blue-600">QR Attendance</div>

          <div className="hidden sm:flex space-x-4 items-center">
            <NavLink to="/">Trang Chủ</NavLink>
            <NavLink to="/students">Sinh Viên</NavLink>
            <NavLink to="/login">Đăng Nhập</NavLink> 
            <NavLink to="/register">Đăng Ký</NavLink> 
            
            {/* Nút Logout nằm ở cuối Menu */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium"
            >
              Đăng Xuất
            </button>
          </div>

          <div className="sm:hidden text-gray-400 italic text-sm">Menu</div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Gọi Navbar đã được tích hợp Logout ở trên */}
        <Navbar />

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[70vh]">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/students" element={<StudentPage />} />
              <Route path="/login" element={<Login />} /> 
              <Route path="/register" element={<Register />} /> 
            </Routes>
          </div>
        </main>

        <footer className="text-center py-6 text-gray-500 text-sm">
          &copy; 2026 Hệ thống quản lý sinh viên.
        </footer>
      </div>
    </Router>
  );
}

export default App;