import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
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
      className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
      }`}
    >
      {children}
    </Link>
  );
};

// Component Navbar với Dropdown cho Admin
const Navbar = () => {
  const navigate = useNavigate();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user_token"); 
    alert("Bạn đã đăng xuất thành công!");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {/* 🛠️ GIỮ max-w-7xl Ở ĐÂY ĐỂ MENU NAVBAR KHÔNG BỊ TRÀN BẠT MẠNG 🛠️ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="font-bold text-lg text-blue-600">QR Attendance</div>

          <div className="hidden sm:flex space-x-3 items-center">
            <NavLink to="/home">Trang Chủ</NavLink>
            
            <div 
              className="relative"
              onMouseEnter={() => setIsAdminOpen(true)}
              onMouseLeave={() => setIsAdminOpen(false)}
            >
              <button className="flex items-center px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 font-medium focus:outline-none">
                Quản Lý
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transform transition-transform ${isAdminOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isAdminOpen && (
                <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                  <Link to="/students" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition">
                    Quản lý Sinh viên
                  </Link>
                  <Link to="/teachers" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition">
                    Quản lý Giáo viên
                  </Link>
                </div>
              )}
            </div>

            <NavLink to="/login">Đăng Nhập</NavLink> 
            <NavLink to="/register">Đăng Ký</NavLink> 
            
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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />

        {/* 🛠️ ĐÃ SỬA THẺ MAIN: CO GIÃN THÔNG MINH, CÁCH ĐỀU LỀ 5-10CM 🛠️ */}
        {/* - w-[90%]: Ép thẻ main chiếm đúng 90% chiều rộng màn hình.
            - 10% còn lại chia đều 2 bên mép chính là khoảng cách 5-10cm cực đẹp mà bạn muốn!
            - max-w-[1400px]: Chặn lại một chút nếu bạn dùng màn hình siêu rộng (UltraWide) để nội dung không bị bẹt ngang quá đà.
            - mx-auto: Căn giữa chiếc khung 90% này một cách hoàn hảo.
        */}
        <main className="w-[90%] max-w-[1400px] mx-auto py-8 sm:py-12 flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            
            <Route path="/home" element={<HomePage />} />
            <Route path="/students" element={<StudentPage />} />
            <Route path="/login" element={<Login />} /> 
            <Route path="/register" element={<Register />} /> 
          </Routes>
        </main>

        <footer className="text-center py-6 text-gray-500 text-sm bg-white border-t border-gray-100">
          &copy; 2026 Hệ thống quản lý sinh viên.
        </footer>
      </div>
    </Router>
  );
}

export default App;