<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\ClassSession;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str; // QUAN TRỌNG: Thêm Str để tạo chuỗi ngẫu nhiên
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AttendanceExport;

class AttendanceController extends Controller
{
    /**
     * API: Tạo mã QR động cho giảng viên
     * Giảng viên gọi API này mỗi 30-40s để đổi mã mới chống gian lận
     */
    public function generateQRToken($sessionId)
    {
        $session = ClassSession::findOrFail($sessionId);

        // 1. Tạo mã token ngẫu nhiên 32 ký tự
        $token = Str::random(32);
        
        // 2. Cài đặt thời gian hết hạn (Ví dụ: 45 giây tính từ lúc tạo)
        $expiredAt = Carbon::now()->addSeconds(45);

        // 3. Lưu token và thời gian hết hạn vào DB
        $session->update([
            'qr_token' => $token,
            'expired_at' => $expiredAt
        ]);

        return response()->json([
            'qr_token' => $token,
            'expires_in' => 30, // Gợi ý Frontend cứ 30s thì gọi lại API này 1 lần
            'expires_at' => $expiredAt->toDateTimeString()
        ]);
    }

    /**
     * Lấy lịch sử điểm danh của sinh viên đang đăng nhập
     */
    public function studentHistory() 
    {
        $history = Attendance::where('student_id', auth()->user()->student_id)
            ->with('session.course')
            ->get();
        return response()->json($history);
    }

    /**
     * Lấy danh sách Realtime cho Giảng viên (Có cả sinh viên chưa quét mã)
     */
    public function getRoomStatus($sessionId)
    {
        $data = DB::table('students as s')
            ->leftJoin('attendance as a', function($join) use ($sessionId) {
                $join->on('s.id', '=', 'a.student_id')
                     ->where('a.session_id', '=', $sessionId);
            })
            ->where('s.class_id', '=', function($query) use ($sessionId) {
                $query->select('class_id')
                      ->from('class_sessions')
                      ->where('id', '=', $sessionId);
            })
            ->select('s.full_name', 's.student_code', 'a.status', 'a.checkin_time')
            ->orderBy('a.checkin_time', 'desc')
            ->get();

        return response()->json($data);
    }

    /**
     * Xử lý lưu dữ liệu điểm danh từ Sinh viên quét mã
     */
    public function store(Request $request)
    {
        // 1. Bắt buộc phải gửi qr_token lên
        $request->validate([
            'session_id' => 'required|exists:class_sessions,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'qr_token' => 'required|string', // Thêm dòng này
        ]);

        $session = ClassSession::findOrFail($request->session_id);

        // 2. KIỂM TRA BẢO MẬT TOKEN
        // Kiểm tra xem Token gửi lên có khớp với Token đang lưu trong DB không
        if ($session->qr_token !== $request->qr_token) {
            return response()->json(['message' => 'Mã QR không hợp lệ hoặc màn hình đã đổi mã mới!'], 400);
        }

        // Kiểm tra xem Token đã hết hạn chưa (quá 45 giây)
        if ($session->expired_at && Carbon::now()->gt(Carbon::parse($session->expired_at))) {
            return response()->json(['message' => 'Mã QR đã hết hạn, vui lòng quét mã mới trên màn hình!'], 400);
        }

        $now = Carbon::now(); 
        
        // Giờ bắt đầu và kết thúc chuẩn từ Database
        $startTime = Carbon::parse($session->session_date . ' ' . $session->start_time);
        $endTime = Carbon::parse($session->session_date . ' ' . $session->end_time);

        // Kiểm tra kết thúc buổi học
        if ($now->gt($endTime)) {
            return response()->json(['message' => 'Buổi học này đã kết thúc!'], 400);
        }

        // Logic tính trạng thái: TRỄ 10 GIÂY
        $status = 'Có mặt';
        if ($now->gt($startTime->copy()->addSeconds(10))) {
            $status = 'Muộn';
        }

        try {
            // Kiểm tra đã điểm danh chưa để tránh trùng lặp
            $exists = Attendance::where('student_id', Auth::user()->student_id)
                                ->where('session_id', $request->session_id)
                                ->exists();
            
            if ($exists) {
                return response()->json(['message' => 'Bạn đã điểm danh cho buổi học này rồi!'], 400);
            }

            $attendance = Attendance::create([
                'student_id'   => Auth::user()->student_id,
                'session_id'   => $request->session_id,
                'checkin_time' => $now,
                'status'       => $status,
                'latitude'     => $request->latitude,
                'longitude'    => $request->longitude,
            ]);

            return response()->json([
                'message' => 'Điểm danh thành công!',
                'status'  => $status,
                'data'    => $attendance->load('student')
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi hệ thống!', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Xuất file Excel
     */
    public function exportExcel($sessionId)
    {
        return Excel::download(new AttendanceExport($sessionId), "diem-danh-buoi-{$sessionId}.xlsx");
    }
    /**
     * API Thống kê Dashboard cho 1 môn học cụ thể
     */
    public function getCourseStatistics($courseId)
    {
        // 1. Lấy thông tin khóa học và đếm số buổi học
        $course = \App\Models\Course::withCount('sessions')->findOrFail($courseId);
        $totalSessions = $course->sessions_count;

        // 2. Đếm tổng số sinh viên thuộc lớp của môn học này
        $totalStudents = \DB::table('students')->where('class_id', $course->class_id)->count();

        // 3. Lấy danh sách ID của các buổi học thuộc môn này
        $sessionIds = \DB::table('class_sessions')->where('course_id', $courseId)->pluck('id');

        // 4. Đếm số lượt đã điểm danh (Trạng thái không phải NULL)
        $presentCount = \DB::table('attendance')
            ->whereIn('session_id', $sessionIds)
            ->whereNotNull('status')
            ->count();

        // 5. Tính toán số lượt vắng và tỉ lệ
        $totalPossibleAttendances = $totalSessions * $totalStudents;
        $absentCount = $totalPossibleAttendances - $presentCount;
        
        $attendanceRate = $totalPossibleAttendances > 0 
            ? round(($presentCount / $totalPossibleAttendances) * 100, 2) 
            : 0;

        return response()->json([
            'course_name'     => $course->course_name,
            'total_sessions'  => $totalSessions,
            'total_students'  => $totalStudents,
            'present_count'   => $presentCount,
            'absent_count'    => $absentCount > 0 ? $absentCount : 0,
            'attendance_rate' => $attendanceRate
        ]);
    }
}