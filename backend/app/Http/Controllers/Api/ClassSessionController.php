<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassSession;
use Illuminate\Http\Request;

class ClassSessionController extends Controller
{
    // Lấy danh sách buổi học của 1 môn cụ thể
    public function index(Request $request)
    {
        $request->validate(['course_id' => 'required|exists:courses,id']);

        $sessions = ClassSession::where('course_id', $request->course_id)
            ->orderBy('session_date', 'asc')
            ->get();

        return response()->json($sessions);
    }

    // Tạo một buổi học mới
    public function store(Request $request)
    {
        // 1. Kiểm tra dữ liệu đầu vào
        $validatedData = $request->validate([
            'course_id'    => 'required|exists:courses,id',
            'session_date' => 'required|date',
            'start_time'   => 'required',
            'end_time'     => 'required',
            // 'room' không có trong DB nên không cần validate hoặc chỉ dùng để tạm
        ]);

        // 2. Khởi tạo Object
        $session = new ClassSession();
        $session->course_id = $validatedData['course_id'];
        $session->session_date = $validatedData['session_date'];

        // Chuyển đổi định dạng giờ cho chuẩn Database
        $session->start_time = date("H:i:s", strtotime($validatedData['start_time']));
        $session->end_time = date("H:i:s", strtotime($validatedData['end_time']));

        // SỬA LỖI TÊN CỘT THEO DATABASE CỦA BẠN:
        // Vì DB không có cột 'room', chúng ta bỏ qua không gán.
        // Nếu bạn muốn dùng cột 'qr_code' để chứa token:
        $token = \Illuminate\Support\Str::random(40);
        $session->qr_code = $token;  // DB của bạn dùng qr_code
        $session->qr_token = $token; // Cột này có trong Model ClassSession.php của bạn

        $session->expired_at = now()->addHours(2);


        // 3. Lưu vào Database
        $session->save();

        return response()->json([
            'message' => 'Tạo buổi học thành công',
            'data'    => $session
        ], 201);
    }
    // Xóa buổi học (Nếu tạo nhầm)
    public function destroy($id)
    {
        $session = ClassSession::find($id);
        if (!$session) {
            return response()->json(['message' => 'Không tìm thấy buổi học!'], 404);
        }
        $session->delete();
        return response()->json(['message' => 'Đã xóa buổi học thành công!']);
    }
}
