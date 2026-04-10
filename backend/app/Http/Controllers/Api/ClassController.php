<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    // 1. Lấy danh sách lớp
    public function index()
    {
        return response()->json(Classroom::all(), 200);
    }

    // 2. Thêm lớp mới
    public function store(Request $request)
    {
        // Kiểm tra dữ liệu đầu vào (không được trùng tên lớp)
        $request->validate([
            'class_name' => 'required|string|max:100|unique:classes,class_name'
        ]);

        $class = Classroom::create($request->all());

        return response()->json([
            'message' => 'Thêm lớp thành công',
            'data' => $class
        ], 201);
    }

    // 3. Cập nhật lớp học
    public function update(Request $request, $id)
    {
        $class = Classroom::find($id);

        if (!$class) {
            return response()->json(['message' => 'Không tìm thấy lớp học'], 404);
        }

        // Validate tên mới (vẫn cho phép giữ tên cũ của chính nó nhưng không được trùng lớp khác)
        $request->validate([
            'class_name' => 'required|string|max:100|unique:classes,class_name,' . $id
        ]);

        $class->update($request->all());

        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => $class
        ], 200);
    }

    // 4. Xóa lớp
    public function destroy(Request $request, $id)
    {
        // Kiểm tra nếu KHÔNG PHẢI admin thì chặn lại ngay
        if (request()->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện hành động này!'
            ], 403);
        }

        $class = Classroom::find($id);

        if (!$class) {
            return response()->json(['message' => 'Không tìm thấy lớp học'], 404);
        }

        $class->delete();

        return response()->json(['message' => 'Đã xóa lớp thành công'], 200);
    }
}
