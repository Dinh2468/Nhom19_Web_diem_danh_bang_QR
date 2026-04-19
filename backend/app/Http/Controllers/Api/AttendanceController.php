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
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AttendanceExport;

class AttendanceController extends Controller
{
    /**
     * API: Tạo mã QR động cho giảng viên
     */
    public function generateQRToken($sessionId)
    {
        $session = ClassSession::findOrFail($sessionId);
        $token = Str::random(32); // Đây là chuỗi ngẫu nhiên
        $expiredAt = Carbon::now()->addSeconds(90);

        // CHỈ lưu chuỗi ngẫu nhiên vào DB
        $session->update([
            'qr_token' => $token,
            'expired_at' => $expiredAt
        ]);

        return response()->json([
            // Trả về định dạng ghép để React tách ra được
            'qr_token' => $sessionId . '-' . $token,
            'expires_in' => 90,
            'expires_at' => $expiredAt->toDateTimeString()
        ]);
    }

    /**
     * Lấy lịch sử điểm danh của sinh viên
     */
    public function studentHistory()
    {
        $history = Attendance::where('student_id', auth()->user()->student_id)
            ->with('session.course')
            ->get();
        return response()->json($history);
    }

    /**
     * Lấy danh sách Realtime cho Giảng viên
     */
    /**
     * Lấy danh sách Realtime cho Giảng viên (Đã tối ưu thứ tự hiển thị)
     */
    public function getRoomStatus($sessionId)
    {
        $data = DB::table('students as s')
            ->leftJoin('attendance as a', function ($join) use ($sessionId) {
                $join->on('s.id', '=', 'a.student_id')
                    ->where('a.session_id', '=', $sessionId);
            })
            ->where('s.class_id', '=', function ($query) use ($sessionId) {
                $query->select('c.class_id')
                    ->from('class_sessions as cs')
                    ->join('courses as c', 'cs.course_id', '=', 'c.id') // Join qua courses
                    ->where('cs.id', '=', $sessionId);
            })
            ->select('s.full_name', 's.student_code', 'a.status', 'a.checkin_time')
            ->orderByRaw('CASE WHEN a.status IS NULL THEN 1 ELSE 0 END, a.checkin_time DESC')
            ->get();

        return response()->json($data);
    }

    /**
     * Xử lý lưu dữ liệu điểm danh từ Sinh viên
     */
    public function store(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:class_sessions,id',
            'qr_token' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $session = ClassSession::findOrFail($request->session_id);

        // 1. Xác định đúng tên cột trong DB (Nếu DB của bạn là qr_code thì đổi qr_token thành qr_code)
        $dbToken = (string) $session->qr_token;
        $sentToken = (string) $request->qr_token;

        if (str_contains($sentToken, '-')) {
            $parts = explode('-', $sentToken);
            // Nếu phần đầu là sessionId, lấy phần sau làm token
            if ($parts[0] == $request->session_id) {
                $sentToken = implode('-', array_slice($parts, 1));
            }
        }

        // 2. So sánh bằng hàm an toàn và thêm Debug để nhìn rõ lỗi ở tab Response
        if (!hash_equals($dbToken, $sentToken)) {
            return response()->json([
                'message' => 'Mã QR không khớp hoặc đã bị đổi!',
                'debug' => [
                    'token_trong_db' => $dbToken,
                    'token_gui_len'  => $sentToken,
                    'so_khop'        => false
                ]
            ], 400);
        }
        // Kiểm tra sinh viên (Đảm bảo student_id tồn tại trong bảng users)
        $studentId = Auth::user()->student_id;
        if (!$studentId) {
            return response()->json(['message' => 'Tài khoản không có thông tin sinh viên!'], 403);
        }


        // TẠM ẨN KIỂM TRA HẾT HẠN ĐỂ TEST THÔNG LUỒNG
        /*
        if ($session->expired_at && Carbon::now()->gt(Carbon::parse($session->expired_at))) {
            return response()->json(['message' => 'Mã QR đã hết hạn!'], 400);
        }
        */

        $now = Carbon::now();
        $startTime = Carbon::parse($session->session_date . ' ' . $session->start_time);

        $status = 'Có mặt';
        if ($now->gt($startTime->copy()->addMinutes(15))) {
            $status = 'Muộn';
        }

        try {
            $studentId = Auth::user()->student_id;

            $exists = Attendance::where('student_id', $studentId)
                ->where('session_id', $request->session_id)
                ->exists();

            if ($exists) {
                return response()->json(['message' => 'Bạn đã điểm danh rồi!'], 400);
            }

            $attendance = Attendance::create([
                'student_id'   => $studentId,
                'session_id'   => $request->session_id,
                'checkin_time' => $now,
                'status'       => $status,
                'latitude'     => $request->latitude,
                'longitude'    => $request->longitude,
            ]);

            return response()->json([
                'message' => 'Điểm danh thành công!',
                'status'  => $status,
                'course_name' => $session->course->course_name ?? 'Môn học',
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
     * API Thống kê Dashboard
     */
    public function getCourseStatistics($courseId)
    {
        $course = \App\Models\Course::withCount('sessions')->findOrFail($courseId);
        $totalSessions = $course->sessions_count;
        $totalStudents = \DB::table('students')->where('class_id', $course->class_id)->count();
        $sessionIds = \DB::table('class_sessions')->where('course_id', $courseId)->pluck('id');

        $presentCount = \DB::table('attendance')
            ->whereIn('session_id', $sessionIds)
            ->whereNotNull('status')
            ->count();

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
