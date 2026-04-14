<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\ClassSession;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // QUAN TRỌNG: Thêm dòng này để chạy Query Builder
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AttendanceExport;

class AttendanceController extends Controller
{
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
        // Dùng Query Builder với Left Join để lấy cả những SV có status là NULL
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
            ->orderBy('a.checkin_time', 'desc') // Người mới quét hiện lên đầu
            ->get();

        return response()->json($data);
    }

    /**
     * Xử lý lưu dữ liệu điểm danh từ Sinh viên quét mã
     */
    public function store(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:class_sessions,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $session = ClassSession::findOrFail($request->session_id);
        $now = Carbon::now(); 
        
        // Giờ bắt đầu và kết thúc chuẩn từ Database
        $startTime = Carbon::parse($session->session_date . ' ' . $session->start_time);
        $endTime = Carbon::parse($session->session_date . ' ' . $session->end_time);

        // 1. Kiểm tra kết thúc buổi học
        if ($now->gt($endTime)) {
            return response()->json(['message' => 'Buổi học này đã kết thúc!'], 400);
        }

        // 2. Logic tính trạng thái: TRỄ 10 GIÂY
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
     * Xuất file Excel (Dat có thể bổ sung logic AttendanceExport sau)
     */
    public function exportExcel($sessionId)
    {
        return Excel::download(new AttendanceExport($sessionId), "diem-danh-buoi-{$sessionId}.xlsx");
    }
}   