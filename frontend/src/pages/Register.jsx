import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',       // Sẽ lưu vào cột 'name' trong DB
    email: '',      // Sẽ lưu vào cột 'email' trong DB
    password: '',   // Sẽ lưu vào cột 'password' trong DB
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Kiểm tra mật khẩu khớp nhau trước khi gửi
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu nhập lại không khớp!');
      return;
    }

    try {
      // 2. Gửi yêu cầu Đăng ký thật sự xuống Backend (Cổng 8001)
      const response = await axios.post('http://127.0.0.1:8001/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'student' // Mặc định quyền sinh viên để không bị lỗi DB
      });

      // 3. Nếu thành công
      if (response.status === 200 || response.status === 201) {
        alert('Chúc mừng Vũ! Đăng ký thành công. Giờ bạn hãy đăng nhập nhé.');
        window.location.href = '/login'; 
      }
    } catch (error) {
      // 4. Nếu thất bại (Lỗi cổng, lỗi DB...)
      console.error("Lỗi chi tiết:", error.response);
      alert('Lỗi: ' + (error.response?.data?.message || 'Không kết nối được Backend. Vũ nhớ bật php artisan serve --port=8001 nhé!'));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký Nhóm 19</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên người dùng (Name)</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nhập lại mật khẩu</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Đăng Ký Ngay
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;