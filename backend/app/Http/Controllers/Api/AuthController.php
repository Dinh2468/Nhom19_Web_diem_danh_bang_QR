<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /**
     * Xử lý Đăng ký thành viên mới (Mặc định là Student)
     */
    public function register(Request $request)
    {
        // 1. Kiểm tra dữ liệu đầu vào từ Register.jsx
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        try {
            // Sử dụng Transaction để đảm bảo: Nếu 1 trong 2 bảng lỗi thì sẽ không lưu bảng nào cả
            return DB::transaction(function () use ($request) {
                
                // BƯỚC 1: Tạo bản ghi bên bảng Students
                $student = Student::create([
                    'student_code' => 'SV' . time(), // Tự tạo mã SV dựa trên thời gian
                    'full_name'    => $request->name,
                    'email'        => $request->email,
                    'class_id'     => 1, // Mặc định gán vào lớp ID 1 (D22_TH15 của Vũ)
                ]);

                // BƯỚC 2: Tạo bản ghi bên bảng Users và KẾT NỐI qua student_id
                $user = User::create([
                    'name'       => $request->name,
                    'email'      => $request->email,
                    'password'   => Hash::make($request->password), // Mã hóa Bcrypt
                    'role'       => 'student',
                    'student_id' => $student->id, // Lấy ID tự tăng của student vừa tạo ở trên
                ]);

                return response()->json([
                    'message' => 'Đăng ký thành công!',
                    'user'    => $user
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Xử lý Đăng nhập (Hỗ trợ Email hoặc Mã SV/GV)
     */
    public function login(Request $request)
    {
        $request->validate([
            'login_id' => 'required', // Nhận Email từ Login.jsx
            'password' => 'required',
        ]);

        // 1. Tìm User theo Email trước (Ưu tiên cho tài khoản mới đăng ký)
        $user = User::where('email', $request->login_id)->first();

        // 2. Nếu không tìm thấy theo Email, thử tìm theo Mã số sinh viên (Dữ liệu cũ của nhóm)
        if (!$user) {
            $student = Student::where('student_code', $request->login_id)->first();
            if ($student) {
                $user = User::where('student_id', $student->id)->first();
            }
        }

        // 3. Nếu vẫn không thấy, thử tìm theo Mã số giảng viên (Để Admin/Teacher vào được)
        if (!$user) {
            $teacher = Teacher::where('teacher_code', $request->login_id)->first();
            if ($teacher) {
                $user = User::where('teacher_id', $teacher->id)->first();
            }
        }

        // 4. Kiểm tra mật khẩu mã hóa
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Sai tài khoản hoặc mật khẩu!'], 401);
        }

        // 5. Tạo Token xác thực (Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Đăng nhập thành công!',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'role'         => $user->role,
            'user'         => $user
        ]);
    }

    /**
     * Đăng xuất và hủy Token
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Đã đăng xuất thành công!']);
    }
}