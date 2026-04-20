<?php
// File: app/Http/Controllers/Api/UserController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,student,teacher',
            // Yêu cầu nhập mã nếu không phải admin
            'code' => [
                'nullable', // Cho phép null đối với Admin
                'required_if:role,student,teacher',
                'string',
                'unique:students,student_code',
                'unique:teachers,teacher_code'
            ],
        ]);

        return DB::transaction(function () use ($validated) {
            $studentId = null;
            $teacherId = null;

            // 1. Tạo bản ghi chi tiết trước
            if ($validated['role'] === 'student') {
                $student = Student::create([
                    'student_code' => $validated['code'],
                    'full_name'    => $validated['name'],
                    'email'        => $validated['email'],
                ]);
                $studentId = $student->id;
            } elseif ($validated['role'] === 'teacher') {
                $teacher = Teacher::create([
                    'teacher_code' => $validated['code'],
                    'full_name'    => $validated['name'],
                    'email'        => $validated['email'],
                ]);
                $teacherId = $teacher->id;
            }

            // 2. Tạo tài khoản User và gắn ID liên kết
            $user = User::create([
                'name'       => $validated['name'],
                'email'      => $validated['email'],
                'password'   => Hash::make($validated['password']),
                'role'       => $validated['role'],
                'student_id' => $studentId,
                'teacher_id' => $teacherId,
                'qr_token'   => $validated['code'] ?? 'ADM_' . time(),
            ]);

            return response()->json(['message' => 'Tạo tài khoản thành công', 'user' => $user], 201);
        });
    }
    public function index()
    {
        // Lấy danh sách kèm thông tin student/teacher để hiện mã định danh
        $users = User::with(['student', 'teacher'])->get();
        return response()->json($users);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Không tìm thấy'], 404);

        $user->delete();
        return response()->json(['message' => 'Xóa tài khoản thành công']);
    }
}
