<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login_id' => 'required', // MSSV, MSGV hoặc Email
            'password' => 'required',
        ]);

        $loginId = $request->login_id;
        $user = null;

        // 1. Kiểm tra nếu là Email (Dành cho Admin)
        if (filter_var($loginId, FILTER_VALIDATE_EMAIL)) {
            $user = User::where('email', $loginId)->where('role', 'admin')->first();
        } else {
            // 2. Kiểm tra nếu là MSSV (Sinh viên)
            $student = Student::where('student_code', $loginId)->first();
            if ($student) {
                $user = User::where('student_id', $student->id)->first();
            } else {
                // 3. Kiểm tra nếu là MSGV (Giáo viên)
                $teacher = Teacher::where('teacher_code', $loginId)->first();
                if ($teacher) {
                    $user = User::where('teacher_id', $teacher->id)->first();
                }
            }
        }

        // Kiểm tra cuối cùng
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Thông tin đăng nhập không chính xác.'
            ], 401);
        }

        // Tạo Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        // Lấy user hiện tại đang đăng nhập và xóa token của họ
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đã đăng xuất thành công.'
        ]);
    }
}
