import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login_id: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        login_id: formData.login_id,
        password: formData.password
      });

      // Lưu thông tin vào bộ nhớ trình duyệt
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('role', response.data.role);
      
      alert("Đăng nhập thành công!");
      
      // Điều hướng dựa trên quyền (Role)
      const role = response.data.role;
      if (role === 'admin') navigate('/students');
      else if (role === 'teacher') navigate('/teachers');
      else navigate('/home');

    } catch (error) {
      const msg = error.response?.data?.message || "Sai tài khoản hoặc mật khẩu!";
      alert(msg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập Hệ Thống</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tài khoản</label>
            <input
              type="text"
              name="login_id"
              onChange={handleChange}
              placeholder="Nhập Email, MSSV hoặc MSGV"
              className="w-full px-4 py-2 mt-1 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 mt-1 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition">
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;