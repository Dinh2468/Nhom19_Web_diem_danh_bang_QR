<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Exception;

class ClassController extends Controller
{
    // 1. Lấy danh sách lớp
    public function index()
    {
        try {
            $classes = Classroom::all();
            return response()->json([
                'success' => true,
                'data' => $classes
            ], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // 2. Thêm lớp mới
    public function store(Request $request)
    {
        try {
            $request->validate([
                'class_name' => 'required|string|max:100|unique:classes,class_name'
            ]);

            $class = Classroom::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Thêm lớp thành công',
                'data' => $class
            ], 201);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    // 3. Cập nhật lớp học
    public function update(Request $request, $id)
    {
        try {
            $class = Classroom::find($id);

            if (!$class) {
                return response()->json(['success' => false, 'message' => 'Không tìm thấy lớp học'], 404);
            }

            $request->validate([
                'class_name' => 'required|string|max:100|unique:classes,class_name,' . $id
            ]);

            $class->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật thành công',
                'data' => $class
            ], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // 4. Xóa lớp (Đã lược bỏ check role admin để Vũ test cho nhanh)
    public function destroy($id)
    {
        try {
            $class = Classroom::find($id);

            if (!$class) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Không tìm thấy lớp học'
                ], 404);
            }

            // Kiểm tra nếu lớp có sinh viên thì không cho xóa (tránh lỗi khóa ngoại)
            if (method_exists($class, 'students') && $class->students()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lớp này đang có sinh viên, không thể xóa!'
                ], 400);
            }

            $class->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa lớp thành công'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false, 
                'message' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }
}