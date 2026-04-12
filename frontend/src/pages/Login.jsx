import React, { useState } from 'react';
import axios from 'axios'; // Đừng quên import axios nhé!

const Login = () => {
  const [formData, setFormData] = useState({
    login_id: '', // Đổi từ username thành login_id cho đồng bộ
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi đúng login_id và password lên Backend
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        login_id: formData.login_id,
        password: formData.password
      });

      // Lưu Token và Role vào localStorage
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert("Đăng nhập thành công!");

      // Chuyển hướng theo Role
      const role = response.data.role;
      if (role === 'admin') window.location.href = '/admin';
      else if (role === 'teacher') window.location.href = '/teacher';
      else window.location.href = '/student';

    } catch (error) {
      // Xử lý lỗi đăng nhập (401, 422...)
      const errorMsg = error.response?.data?.message || "Lỗi kết nối máy chủ!";
      alert(errorMsg);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-[70vh] overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-sm p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Chào mừng trở lại</h2>
          <p className="text-sm text-gray-500">Hệ thống điểm danh sinh viên STU</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tài khoản</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                name="login_id" // Sửa lại name khớp với State
                value={formData.login_id}
                onChange={handleChange}
                placeholder="Nhập MSSV, MSGV hoặc Email"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50/50"
                required
              />
            </div>
          </div>

          <div className="text-right">
            <button type="button" onClick={() => alert("Liên hệ phòng đào tạo!")} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 font-semibold text-base flex items-center justify-center"
          >
            Đăng Nhập
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Chưa có tài khoản?{' '}
          <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;