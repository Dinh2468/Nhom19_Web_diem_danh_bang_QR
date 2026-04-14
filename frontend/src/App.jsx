import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import Component
import Navbar from "./components/Navbar";

// Import Pages
import HomePage from "./pages/Home";
import StudentPage from "./pages/Student";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import ClassPage from "./pages/ClassPage";
import SubjectPage from "./pages/SubjectPage";
import Teacherpage from "./pages/Teacher"; //  Đổi tên import cho dễ nhớ
// QUAN TRỌNG: Import file giao diện của Vũ
import TeacherDashboard from "./pages/TeacherDashboard"; 

function App() {
  return (
    // PHẢI có Router bao ngoài cùng để không bị lỗi useNavigate
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        
        <Navbar />

        <main className="w-[95%] max-w-[1400px] mx-auto py-8 sm:py-12 flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} /> 
            <Route path="/register" element={<Register />} /> 

            {/* Quản lý cho Admin */}
            <Route path="/students" element={<StudentPage />} />
            <Route path="/classes" element={<ClassPage />} />
            <Route path="/subjects" element={<SubjectPage />} />

            {/* SỬA LẠI ĐƯỜNG DẪN NÀY CHO KHỚP VỚI TRÌNH DUYỆT CỦA VŨ */}
            <Route path="/teachers" element={<TeacherDashboard />} />
            { <Route path="/Teacher" element= {<Teacherpage />} />}

            
          </Routes>
        </main>

        <footer className="text-center py-6 text-gray-400 text-xs bg-white border-t border-gray-100">
          &copy; 2026 Hệ thống điểm danh QR STU 
        </footer>
      </div>
    </Router>
  );
}

export default App;