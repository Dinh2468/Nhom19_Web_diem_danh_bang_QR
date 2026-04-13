<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use Exception;

class SinhVienController extends Controller
{
    public function index()
    {
        try {
            $students = Student::with('classroom')->get();
            return response()->json(['success' => true, 'data' => $students], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'student_code' => 'required|unique:students,student_code',
                'full_name'    => 'required',
                'email'        => 'required|email|unique:students,email',
                'class_id'     => 'required|exists:classes,id',
            ]);

            $sv = Student::create($validated);
            return response()->json([
                'success' => true,
                'message' => 'Thêm thành công',
                'data' => $sv->load('classroom')
            ], 201);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $sv = Student::findOrFail($id);
            $sv->update($request->all());
            return response()->json(['success' => true, 'data' => $sv->load('classroom')]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // --- HÀM XÓA CHUẨN ---
    public function destroy($id)
    {
        try {
            $student = Student::find($id);
            if (!$student) {
                return response()->json(['success' => false, 'message' => 'Không tìm thấy sinh viên'], 404);
            }
            $student->delete();
            return response()->json(['success' => true, 'message' => 'Xóa thành công'], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }
}