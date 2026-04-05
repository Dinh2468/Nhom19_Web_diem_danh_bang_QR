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
import TeacherPage from "./pages/Teacher";

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-700 hover:text-blue-600"
      }`}
    >
      {children}
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-xl font-bold text-blue-600">
                QR Attendance
              </Link>
              <div className="hidden md:flex space-x-8 items-center">
                <NavLink to="/">Trang Chủ</NavLink>
                <NavLink to="/students">Sinh Viên</NavLink>
                <NavLink to="/teachers">Giáo viên</NavLink>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/students" element={<StudentPage />} />
            <Route path="/teachers" element={<TeacherPage />} />
          </Routes>
        </main>

        <footer className="text-center py-8 text-gray-500 text-sm border-t border-gray-200">
          &copy; 2026 STU Attendance System.
        </footer>
      </div>
    </Router>
  );
}

export default App;
