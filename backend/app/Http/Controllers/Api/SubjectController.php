<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    // Lấy danh sách tất cả môn học
    public function index()
    {
        return response()->json(Subject::all(), 200);
    }

    // Thêm môn học mới
    public function store(Request $request)
    {
        $request->validate([
            'subject_code' => 'required|string|max:20|unique:subjects,subject_code',
            'subject_name' => 'required|string|max:100'
        ]);

        $subject = Subject::create($request->all());

        return response()->json([
            'message' => 'Thêm môn học thành công!',
            'data' => $subject
        ], 201);
    }

    // Cập nhật thông tin môn học
    public function update(Request $request, $id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json(['message' => 'Không tìm thấy môn học!'], 404);
        }

        $request->validate([
            'subject_code' => 'required|string|max:20|unique:subjects,subject_code,' . $id,
            'subject_name' => 'required|string|max:100'
        ]);

        $subject->update($request->all());

        return response()->json(['message' => 'Cập nhật môn học thành công!'], 200);
    }

    // Xóa môn học
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền thực hiện hành động này!'], 403);
        }

        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json(['message' => 'Không tìm thấy môn học!'], 404);
        }

        $subject->delete();

        return response()->json(['message' => 'Đã xóa môn học thành công!'], 200);
    }
}
