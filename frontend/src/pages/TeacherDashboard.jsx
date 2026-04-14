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

    const token = localStorage.getItem("token") || localStorage.getItem("user_token");
    const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` }
    };

    // 1. Lấy danh sách môn học khi load trang
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/subjects', axiosConfig);
                const data = Array.isArray(res.data) ? res.data : res.data.data;
                setSubjects(data || []);
            } catch (err) {
                console.error("Lỗi lấy môn học:", err);
            }
        };
        if (token) fetchSubjects();
    }, [token]);

    // 2. Polling Realtime: Cập nhật danh sách mỗi 3 giây
    useEffect(() => {
        let interval;
        if (isSessionActive && selectedSubject) {
            const fetchAttendanceRealtime = async () => {
                try {
                    const res = await axios.get(`http://127.0.0.1:8000/api/attendance/session/${selectedSubject}`, axiosConfig);
                    setAttendanceList(res.data || []);
                } catch (err) {
                    console.error("Lỗi cập nhật danh sách:", err);
                }
            };
            fetchAttendanceRealtime();
            interval = setInterval(fetchAttendanceRealtime, 3000);
        }
        return () => clearInterval(interval);
    }, [isSessionActive, selectedSubject]);

    const handleStart = () => {
        if (!selectedSubject) {
            alert("Vui lòng chọn môn học!");
            return;
        }
        const now = new Date();
        setStartTime(now.toLocaleTimeString('vi-VN'));
        setEndTime(null);
        
        // --- ĐÃ SỬA ---
        // Thay vì tạo chuỗi ngẫu nhiên, ta tạo JSON chứa đúng session_id mà Backend cần
        const qrPayload = JSON.stringify({ session_id: selectedSubject });
        setQrCodeData(qrPayload);
        // --------------
        
        setIsSessionActive(true);
    };

    const handleEnd = () => {
        if (window.confirm("Kết thúc buổi học và xem danh sách sinh viên vắng?")) {
            setEndTime(new Date().toLocaleTimeString('vi-VN'));
            setIsSessionActive(false);
            setQrCodeData("");
            // Lưu ý: Không xóa attendanceList để có dữ liệu hiển thị danh sách vắng
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* CỘT TRÁI: ĐIỀU KHIỂN */}
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">🚀 Thiết lập buổi học</h2>
                    <div className="space-y-5">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chọn môn học</label>
                            <select 
                                className="w-full mt-2 p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-gray-700 outline-none"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                disabled={isSessionActive}
                            >
                                <option value="">-- Danh sách môn học --</option>
                                {subjects.map((sub) => (
                                    <option key={sub.id} value={sub.id}>{sub.subject_name}</option>
                                ))}
                            </select>
                        </div>

                        {!isSessionActive ? (
                            <button onClick={handleStart} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all">
                                BẮT ĐẦU ĐIỂM DANH
                            </button>
                        ) : (
                            <button onClick={handleEnd} className="w-full py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg hover:bg-red-600 transition-all">
                                KẾT THÚC ĐIỂM DANH
                            </button>
                        )}

                        <div className="mt-4 p-4 bg-indigo-50/50 rounded-2xl text-[11px] space-y-3 font-bold text-indigo-900 border border-indigo-100">
                            <p className="flex justify-between">Bắt đầu: <span className="bg-white px-2 py-1 rounded-lg text-indigo-600">{startTime || "--:--"}</span></p>
                            <p className="flex justify-between">Kết thúc: <span className="bg-white px-2 py-1 rounded-lg text-red-500">{endTime || "--:--"}</span></p>
                            <p className="flex justify-between">Sĩ số: <span className="bg-white px-2 py-1 rounded-lg text-green-600">{attendanceList.length} SV</span></p>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: QR & DANH SÁCH */}
                <div className="lg:col-span-2 space-y-6">
                    {isSessionActive || endTime ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                            
                            {/* KHU VỰC HIỂN THỊ QR */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col justify-center">
                                {isSessionActive ? (
                                    <>
                                        <span className="text-[10px] font-black text-indigo-600 mb-4 uppercase bg-indigo-50 px-3 py-1 rounded-full w-fit mx-auto">Vui lòng quét mã bên dưới</span>
                                        <div className="p-4 bg-white border-2 border-dashed border-indigo-100 rounded-3xl inline-block shadow-inner animate-pulse">
                                            <img 
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrCodeData}`} 
                                                alt="Mã QR"
                                                className="mx-auto"
                                            />
                                        </div>
                                        <p className="mt-4 text-gray-400 text-[10px] italic">Trễ 10s sẽ tính là "Muộn"</p>
                                    </>
                                ) : (
                                    <div className="py-20 text-gray-400">
                                        <span className="text-6xl mb-4 block">✅</span>
                                        <p className="font-bold text-xs uppercase tracking-widest">Buổi học kết thúc</p>
                                    </div>
                                )}
                            </div>

                            {/* DANH SÁCH SINH VIÊN REALTIME / VẮNG MẶT */}
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[520px]">
                                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className={`relative flex h-2 w-2 ${isSessionActive ? 'block' : 'hidden'}`}>
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </div>
                                        <span className="font-bold text-gray-700 text-xs uppercase tracking-wider">
                                            {isSessionActive ? "Đang điểm danh" : "Danh sách vắng mặt"}
                                        </span>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${isSessionActive ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'}`}>
                                        {isSessionActive ? "TẤT CẢ" : "VẮNG MẶT"}
                                    </span>
                                </div>
                                
                                <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                                    {attendanceList.length > 0 ? (
                                        <div className="space-y-3">
                                            {attendanceList
                                                // LOGIC LỌC: Khi đã kết thúc, chỉ hiện những người status là null (Vắng)
                                                .filter(item => isSessionActive ? true : item.status === null)
                                                .map((item, idx) => {
                                                    const isAttended = item.status !== null;
                                                    return (
                                                        <div key={idx} className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-500 ${isAttended ? 'bg-white border-indigo-100 shadow-sm' : 'bg-red-50/10 border-red-200'}`}>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${isAttended ? 'bg-indigo-600 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-100'}`}>
                                                                    {item.full_name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className={`text-sm font-bold ${isAttended ? 'text-gray-800' : 'text-red-700'}`}>{item.full_name}</p>
                                                                    <p className="text-[10px] text-gray-400 font-medium">{item.student_code}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="text-right">
                                                                {isAttended ? (
                                                                    <div className="flex flex-col items-end gap-1">
                                                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg border ${item.status === 'Có mặt' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>
                                                                            {item.status.toUpperCase()}
                                                                        </span>
                                                                        <p className="text-[9px] text-gray-400 font-bold">
                                                                            {new Date(item.checkin_time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-[8px] font-black px-2 py-0.5 rounded-lg bg-red-100 text-red-600 border border-red-200">
                                                                        VẮNG MẶT
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs italic space-y-2">
                                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                            <p>Đang tải danh sách sinh viên...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400 shadow-inner">
                            <span className="text-5xl mb-4 animate-bounce">⏳</span>
                            <p className="font-bold uppercase tracking-widest text-xs text-gray-500">Sẵn sàng điểm danh</p>
                            <p className="text-[10px] mt-2 text-gray-400">Chọn môn học bên trái để tạo mã QR</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;