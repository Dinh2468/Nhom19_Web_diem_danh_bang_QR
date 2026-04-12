<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login_id' => 'required', // Email, MSSV hoặc MSGV
            'password' => 'required',
        ]);

        $loginId = $request->login_id;
        $user = null;

        // BƯỚC 1: Thử tìm theo Email trước (Dùng cho cả Admin, GV, SV)
        $user = User::where('email', $loginId)->first();

        // BƯỚC 2: Nếu không thấy Email, thử tìm theo Mã số
        if (!$user) {
            // Tìm trong bảng Student
            $student = Student::where('student_code', $loginId)->first();
            if ($student) {
                $user = User::where('student_id', $student->id)->first();
            } else {
                // Tìm trong bảng Teacher
                $teacher = Teacher::where('teacher_code', $loginId)->first();
                if ($teacher) {
                    $user = User::where('teacher_id', $teacher->id)->first();
                }
            }
        }

        // BƯỚC 3: Kiểm tra mật khẩu (Sử dụng chuỗi đã mã hóa Bcrypt trong DB)
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Thông tin đăng nhập không chính xác.'
            ], 401);
        }

        // BƯỚC 4: Tạo Token Sanctum
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
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Đã đăng xuất thành công.']);
    }
}