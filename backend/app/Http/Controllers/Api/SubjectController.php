<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Exception;

class SubjectController extends Controller
{
    // 1. Lấy danh sách môn học
    public function index()
    {
        try {
            $subjects = Subject::all();
            return response()->json([
                'success' => true,
                'data' => $subjects
            ], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // 2. Thêm môn học mới
    public function store(Request $request)
    {
        try {
            $request->validate([
                'subject_code' => 'required|string|max:20|unique:subjects,subject_code',
                'subject_name' => 'required|string|max:100'
            ]);

            $subject = Subject::create($request->all());

            return response()->json([
                'success' => true, // Thêm dòng này để React nhận diện thành công
                'message' => 'Thêm môn học thành công!',
                'data' => $subject
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false, 
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 422);
        }
    }

    // 3. Cập nhật thông tin môn học
    public function update(Request $request, $id)
    {
        try {
            $subject = Subject::find($id);

            if (!$subject) {
                return response()->json(['success' => false, 'message' => 'Không tìm thấy môn học!'], 404);
            }

            $request->validate([
                'subject_code' => 'required|string|max:20|unique:subjects,subject_code,' . $id,
                'subject_name' => 'required|string|max:100'
            ]);

            $subject->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật môn học thành công!'
            ], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // 4. Xóa môn học
    public function destroy($id)
    {
        try {
            $subject = Subject::find($id);

            if (!$subject) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Không tìm thấy môn học!'
                ], 404);
            }

            // Kiểm tra ràng buộc: Nếu môn học đang nằm trong bảng Course thì không cho xóa
            // (Giả sử bạn có quan hệ courses trong Model Subject)
            if (method_exists($subject, 'courses') && $subject->courses()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Môn học này đang có lớp học (Course), không thể xóa!'
                ], 400);
            }

            $subject->delete();

            return response()->json([
                'success' => true, // Phải có cái này React mới chạy fetchSubjects()
                'message' => 'Đã xóa môn học thành công!'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false, 
                'message' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }
}