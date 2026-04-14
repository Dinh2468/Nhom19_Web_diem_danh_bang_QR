<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class CourseController extends Controller
{
    public function index()
    {
        $courses = DB::table('courses')
            ->leftJoin('subjects', 'courses.subject_id', '=', 'subjects.id')
            ->leftJoin('teachers', 'courses.teacher_id', '=', 'teachers.id')
            ->leftJoin('classes', 'courses.class_id', '=', 'classes.id')
            ->select(
                'courses.*', 
                'subjects.subject_name', 
                'teachers.full_name', 
                'classes.class_name'
            )
            ->get();
            
        return response()->json(['success' => true, 'data' => $courses]);
    }

    public function store(Request $request)
    {
        try {
            // Lệnh insert an toàn: Bỏ qua created_at/updated_at nếu DB không có
            $id = DB::table('courses')->insertGetId([
                'course_name' => $request->course_name,
                'subject_id'  => $request->subject_id,
                'teacher_id'  => $request->teacher_id,
                'class_id'    => $request->class_id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Thêm khóa học thành công!',
                'id' => $id
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            DB::table('courses')
                ->where('id', $id)
                ->update([
                    'course_name' => $request->course_name,
                    'subject_id'  => $request->subject_id,
                    'teacher_id'  => $request->teacher_id,
                    'class_id'    => $request->class_id,
                ]);
            return response()->json(['success' => true, 'message' => 'Cập nhật thành công!']);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        DB::table('courses')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Đã xóa thành công']);
    }
}