<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;

class SinhVienController extends Controller
{
    // 1. Lấy danh sách (Read)
    public function index()
    {
        // Sử dụng with('classroom') để lấy luôn tên lớp học từ bảng classes
        $students = Student::with('classroom')->get();
        return response()->json($students);
    }

    // 2. Thêm mới (Create)
    public function store(Request $request)
    {
        // Validate dữ liệu để tránh lỗi database
        $validated = $request->validate([
            'student_code' => 'required|unique:students',
            'full_name'    => 'required',
            'email'        => 'required|email|unique:students',
            'class_id'     => 'required|exists:classes,id',
        ]);

        $sv = Student::create($validated);

        return response()->json([
            'message' => 'Thêm sinh viên thành công',
            'data' => $sv->load('classroom') // Trả về kèm thông tin lớp
        ], 201);
    }

    // 3. Xem chi tiết (Read detail)
    public function show($id)
    {
        return response()->json(Student::with('classroom')->findOrFail($id));
    }

    // 4. Cập nhật (Update)
    public function update(Request $request, $id)
    {
        $sv = Student::findOrFail($id);
        $sv->update($request->all());

        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => $sv->load('classroom')
        ]);
    }

    // 5. Xóa (Delete)
    public function destroy($id)
    {
        Student::destroy($id);
        return response()->json(['message' => 'Xóa sinh viên thành công']);
    }
}
