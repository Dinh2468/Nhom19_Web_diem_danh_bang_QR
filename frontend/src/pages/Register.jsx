import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    student_code: '',
    full_name: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu nhập lại không khớp!');
      return;
    }
    alert('Đã gửi yêu cầu đăng ký tài khoản thành công!');
  };

  return (
    <div className="relative flex justify-center items-center min-h-[80vh] overflow-hidden py-10">
      {/* Khối màu loang (Gradient) làm nền mờ ảo phía sau */}
      <div className="absolute top-10 -left-10 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-sm p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
        {/* Phần Header của Form */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Tạo tài khoản mới</h2>
          <p className="text-sm text-gray-500">
            Đăng ký để sử dụng hệ thống điểm danh QR
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nhóm 1: Thông tin cá nhân */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Nhập họ và"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mã số sinh viên (MSSV)
              </label>
              <input
                type="text"
                name="student_code"
                value={formData.student_code}
                onChange={handleChange}
                placeholder="Nhập MSSV"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50/50"
                required
              />
            </div>
          </div>

          {/* Ô nhập Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email sinh viên
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@student.stu.edu.vn"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50/50"
              required
            />
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Thông tin tài khoản</span></div>
          </div>

          {/* Ô nhập Tên đăng nhập */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Tạo tài khoản đăng nhập"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50/50"
              required
            />
          </div>

          {/* Nhóm 2: Mật khẩu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50/50"
                required
              />
            </div>
          </div>

          {/* Nút bấm */}
          <button
            type="submit"
            className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 font-semibold text-base flex items-center justify-center"
          >
            Đăng Ký Tài Khoản
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3" />
            </svg>
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Đã có tài khoản?{' '}
          <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;