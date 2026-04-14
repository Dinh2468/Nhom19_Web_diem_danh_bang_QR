import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '', // Đổi tên từ confirmPassword thành password_confirmation cho khớp Laravel
    role: 'student', // Mặc định là sinh viên
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
      // Gửi yêu cầu Đăng ký xuống Backend (Cổng 8001)
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation, // Laravel bắt buộc trường này để dùng validation 'confirmed'
        role: formData.role
      });

      if (response.status === 200 || response.status === 201) {
        // Lấy mã số SV/GV mà hệ thống tự sinh ra từ response của Đỉnh
        const assignedCode = response.data.registration_details.assigned_code;
        
        alert(`Đăng ký thành công! Mã số của bạn là: ${assignedCode}. Hãy dùng mã này hoặc Email để đăng nhập nhé.`);
        navigate('/login'); 
      }
    } catch (error) {
      console.error("Lỗi chi tiết:", error.response);
      const errorMsg = error.response?.data?.message || 'Không kết nối được Backend.';
      alert('Lỗi đăng ký: ' + errorMsg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
           <h2 className="text-3xl font-bold text-gray-800">Đăng Ký Tài Khoản</h2>
           <p className="text-gray-500 text-sm mt-2">Hệ thống điểm danh QR - Nhóm 19</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và Tên</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nguyễn Đức Vũ" className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="vu@example.com" className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Bạn là?</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="student">Sinh viên</option>
              <option value="teacher">Giảng viên</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu (tối thiểu 6 ký tự)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} placeholder="••••••••" className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all duration-300">
            Tạo Tài Khoản
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Đã có tài khoản? <Link to="/login" className="text-blue-600 font-bold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;