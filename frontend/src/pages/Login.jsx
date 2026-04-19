import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const BASE_URL = "https://asyllabic-emelina-uncheated.ngrok-free.dev/api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login_id: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Đảm bảo port 8001 khớp với lệnh 'php artisan serve --port=8001' của Vũ
      const apiUrl = BASE_URL;

      const response = await axios.post(
        `${apiUrl}/login`,
        {
          login_id: formData.login_id,
          password: formData.password,
        },
        {
          headers: { "ngrok-skip-browser-warning": "69420" },
        },
      );

      // Lấy dữ liệu từ object 'user' mà Đỉnh trả về trong AuthController
      const userData = response.data.user;
      const token = response.data.access_token;
      const role = userData.role;

      // 1. Lưu thông tin vào localStorage để duy trì đăng nhập
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(userData));

      alert(response.data.message); // Hiển thị "Đăng nhập thành công!"

      // 2. Điều hướng đúng theo phân quyền (Role)
      if (role === "admin") {
        navigate("/students"); // Chuyển đến trang quản lý sinh viên của Vũ
      } else if (role === "teacher") {
        navigate("/teachers"); // Chuyển đến giao diện giảng viên
      } else {
        navigate("/student-dashboard"); // Trang dành cho Student
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.response);
      // Hiển thị lỗi từ Laravel (ví dụ: "Thông tin đăng nhập không chính xác.")
      const msg =
        error.response?.data?.message || "Không thể kết nối đến máy chủ!";
      alert(msg);
    }
  };

  return (
    <div className="w-full flex justify-center items-center py-10 min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Chào mừng trở lại
          </h2>
          <p className="text-sm text-gray-500">
            Đăng nhập để vào hệ thống điểm danh
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tài khoản
            </label>
            <input
              type="text"
              name="login_id"
              value={formData.login_id}
              onChange={handleChange}
              placeholder="Email, MSSV hoặc MSGV"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300"
          >
            Đăng Nhập Hệ Thống
          </button>
        </form>

        {/* <p className="text-center text-sm text-gray-600 mt-8">
          Chưa có tài khoản?{" "}
          <Link
            to="/dangky"
            className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
