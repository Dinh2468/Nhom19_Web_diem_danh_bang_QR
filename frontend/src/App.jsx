import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import Component
import Navbar from "./components/Navbar";

// Import Pages
import HomePage from "./pages/Home";
import StudentPage from "./pages/Student";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Gọi Navbar ở đây */}
        <Navbar />

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
          &copy; 2026 Hệ thống quản lý sinh viên STU.
        </footer>
      </div>
    </Router>
  );
}

export default App;