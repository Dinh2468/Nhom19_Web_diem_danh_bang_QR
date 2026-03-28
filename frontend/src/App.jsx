import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/Home";
import StudentPage from "./pages/Student";

// Thành phần NavLink để tối ưu code và hiển thị trạng thái đang chọn (active)
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar hiện đại */}
        <nav className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo / Tên dự án */}

              {/* Menu điều hướng */}
              <div className="hidden sm:flex space-x-4">
                <NavLink to="/">Trang Chủ</NavLink>
                <NavLink to="/students">Sinh Viên</NavLink>
              </div>

              {/* Mobile menu button (Có thể thêm sau nếu cần) */}
              <div className="sm:hidden text-gray-400 italic text-sm">Menu</div>
            </div>
          </div>
        </nav>

        {/* Nội dung các trang với hiệu ứng chuyển trang nhẹ */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[70vh]">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/students" element={<StudentPage />} />
            </Routes>
          </div>
        </main>

        {/* Footer đơn giản */}
        <footer className="text-center py-6 text-gray-500 text-sm">
          &copy; 2026 Hệ thống quản lý sinh viên.
        </footer>
      </div>
    </Router>
  );
}

export default App;
