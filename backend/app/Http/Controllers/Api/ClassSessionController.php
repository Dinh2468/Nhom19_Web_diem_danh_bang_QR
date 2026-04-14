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
    $validated = $request->validate([
        'course_id'    => 'required|exists:courses,id',
        'session_date' => 'required|date',
        'start_time'   => 'required',
        'end_time'     => 'required',
        'room'         => 'nullable|string'
    ]);

        $session = ClassSession::create($validated);

        return response()->json([
            'message' => 'Tạo buổi học thành công!', 
            'data' => $session
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