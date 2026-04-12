import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Teacher = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Hàm gọi API lấy danh sách giảng viên
    const fetchTeachers = async () => {
        try {
            // Thay đổi URL này khớp với API Laravel của bạn
            const response = await axios.get('http://127.0.0.1:8000/api/teachers');
            setTeachers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu giảng viên:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header của trang */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản Lý Giảng Viên</h1>
                    <p className="text-sm text-gray-500">Danh sách toàn bộ giảng viên trong hệ thống</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center font-semibold shadow-lg shadow-indigo-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm Giảng Viên
                </button>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mã GV</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Họ và Tên</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="text-center py-10 text-gray-400">Đang tải dữ liệu...</td>
                            </tr>
                        ) : teachers.length > 0 ? (
                            teachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                        {teacher.teacher_code}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">{teacher.full_name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {teacher.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex space-x-3">
                                            <button className="text-blue-600 hover:text-blue-800 font-medium">Sửa</button>
                                            <button className="text-red-600 hover:text-red-800 font-medium">Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-10 text-gray-400">Chưa có dữ liệu giảng viên nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Teacher;