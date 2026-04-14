import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherDashboard = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [qrCodeData, setQrCodeData] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [attendanceList, setAttendanceList] = useState([]);

    // Lấy Token từ localStorage để gửi cho API của Đạt
    const token = localStorage.getItem("token") || localStorage.getItem("user_token");

    const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` }
    };

    // 1. LẤY MÔN HỌC TỪ DATABASE (Khớp với subject_name trong ảnh của Vũ)
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8001/api/subjects', axiosConfig);
                // Laravel thường trả về mảng trực tiếp hoặc nằm trong res.data.data
                const data = Array.isArray(res.data) ? res.data : res.data.data;
                setSubjects(data || []);
            } catch (err) {
                console.error("Lỗi lấy môn học:", err);
            }
        };
        if (token) fetchSubjects();
    }, [token]);

    // 2. LOGIC HIỂN THỊ MÃ QR KHI BẤM NÚT
    const handleStart = () => {
        if (!selectedSubject) {
            alert("Vũ ơi, hãy chọn môn học trước!");
            return;
        }

        const now = new Date();
        setStartTime(now.toLocaleTimeString());
        setEndTime(null);
        
        // Tạo chuỗi dữ liệu cho mã QR (Nội dung này sinh viên sẽ quét)
        const content = `STU_ATTENDANCE_${selectedSubject}_${now.getTime()}`;
        setQrCodeData(content);
        setIsSessionActive(true);
    };

    const handleEnd = () => {
        setEndTime(new Date().toLocaleTimeString());
        setIsSessionActive(false);
        setQrCodeData(""); // Ẩn QR khi kết thúc
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* PHẦN TẠO BUỔI HỌC */}
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-50">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">🚀 Tạo buổi học</h2>

                    <div className="space-y-5">
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase">Môn học từ Database</label>
                            <select 
                                className="w-full mt-2 p-3 bg-gray-50 border-none rounded-xl font-bold text-gray-700"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                disabled={isSessionActive}
                            >
                                <option value="">-- Chọn môn học --</option>
                                {subjects.map((sub) => (
                                    <option key={sub.id} value={sub.subject_code}>
                                        {sub.subject_name} ({sub.subject_code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {!isSessionActive ? (
                            <button onClick={handleStart} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg">
                                BẮT ĐẦU ĐIỂM DANH
                            </button>
                        ) : (
                            <button onClick={handleEnd} className="w-full py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg">
                                KẾT THÚC ĐIỂM DANH
                            </button>
                        )}

                        <div className="mt-4 p-4 bg-gray-50 rounded-2xl text-xs space-y-2 font-bold text-gray-500">
                            <p className="flex justify-between">Bắt đầu: <span className="text-blue-600">{startTime || "--:--"}</span></p>
                            <p className="flex justify-between">Kết thúc: <span className="text-red-600">{endTime || "--:--"}</span></p>
                        </div>
                    </div>
                </div>

                {/* PHẦN HIỂN THỊ QR VÀ REALTIME */}
                <div className="lg:col-span-2">
                    {isSessionActive ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* KHU VỰC HIỆN MÃ QR */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                                <p className="text-[10px] font-black text-blue-600 mb-4 uppercase tracking-widest">Quét mã để điểm danh</p>
                                <div className="p-4 bg-white border-2 border-dashed border-blue-200 rounded-3xl inline-block shadow-inner">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrCodeData}`} 
                                        alt="Mã QR"
                                        className="mx-auto"
                                    />
                                </div>
                                <p className="mt-4 text-gray-400 text-[10px] italic">Mã QR được tạo tự động cho môn {selectedSubject}</p>
                            </div>

                            {/* KHU VỰC REALTIME (DANH SÁCH) */}
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                                    <span className="font-bold text-gray-700 text-sm">Vừa quét mã</span>
                                    <span className="bg-green-500 w-2 h-2 rounded-full animate-ping"></span>
                                </div>
                                <div className="p-4 flex-grow flex items-center justify-center text-gray-400 text-xs text-center">
                                    {/* Chỗ này sau này Vũ dùng useEffect để gọi API /attendance/session/{id} của Đạt */}
                                    Đang đợi sinh viên quét mã...
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                            <span className="text-4xl mb-3">⏳</span>
                            <p className="font-bold uppercase tracking-widest text-xs">Hệ thống đang chờ lệnh từ Vũ...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;