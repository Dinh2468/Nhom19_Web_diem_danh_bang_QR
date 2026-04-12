<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\ClassSession;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    /**
     * Xử lý lưu dữ liệu điểm danh
     */
    public function store(Request $request)
    {
        // 1. Kiểm tra dữ liệu gửi từ Frontend
        $request->validate([
            'session_id' => 'required|exists:class_sessions,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        // 2. Lấy thông tin phiên học (để lấy giờ bắt đầu/kết thúc)
        $session = ClassSession::findOrFail($request->session_id);
        
        // Giờ hiện tại (Đã chỉnh Asia/Ho_Chi_Minh trong config/app.php)
        $now = Carbon::now(); 
        
        // Giờ bắt đầu buổi học (Nối ngày và giờ lại)
        $startTime = Carbon::parse($session->session_date . ' ' . $session->start_time);
        $endTime = Carbon::parse($session->session_date . ' ' . $session->end_time);

        // 3. Kiểm tra xem buổi học đã kết thúc chưa
        if ($now->gt($endTime)) {
            return response()->json(['message' => 'Buổi học này đã kết thúc, không thể điểm danh!'], 400);
        }

        // 4. Logic tính trạng thái tự động (Cho phép trễ 15 phút)
        $status = 'Có mặt';
        if ($now->diffInMinutes($startTime, false) < -15) {
            $status = 'Muộn';
        }

        // 5. Lưu vào bảng attendance
        try {
            $attendance = Attendance::create([
                'student_id'   => Auth::user()->student_id, // Lấy ID sinh viên từ tài khoản đang đăng nhập
                'session_id'   => $request->session_id,
                'checkin_time' => $now,
                'status'       => $status,
                'latitude'     => $request->latitude,
                'longitude'    => $request->longitude,
            ]);

            return response()->json([
                'message' => 'Điểm danh thành công!',
                'data'    => $attendance
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Bạn đã điểm danh cho buổi học này rồi!',
                'error'   => $e->getMessage()
            ], 400);
        }
    }
}