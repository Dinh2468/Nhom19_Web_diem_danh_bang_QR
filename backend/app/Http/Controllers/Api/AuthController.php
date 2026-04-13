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
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false, 
                'message' => $validator->errors()->first()
            ], 422);
        }

        try {
            return DB::transaction(function () use ($request) {
                // Tạo Student trước
                $student = Student::create([
                    'student_code' => 'SV' . time(),
                    'full_name'    => $request->name,
                    'email'        => $request->email,
                    'class_id'     => 1, 
                ]);

                // Tạo User kết nối với Student
                $user = User::create([
                    'name'       => $request->name,
                    'email'      => $request->email,
                    'password'   => Hash::make($request->password),
                    'role'       => 'student',
                    'student_id' => $student->id,
                ]);

                return response()->json([
                    'success' => true, // Thêm để React nhận diện
                    'message' => 'Đăng ký thành công!',
                    'user'    => $user
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        // Chỉnh lại để nhận cả 'email' (từ form Login thông thường) hoặc 'login_id'
        $loginValue = $request->login_id ?? $request->email;

        if (!$loginValue || !$request->password) {
            return response()->json([
                'success' => false, 
                'message' => 'Vui lòng nhập đầy đủ tài khoản và mật khẩu!'
            ], 400);
        }

        // 1. Tìm theo Email
        $user = User::where('email', $loginValue)->first();

        // 2. Tìm theo Mã SV
        if (!$user) {
            $student = Student::where('student_code', $loginValue)->first();
            if ($student) {
                $user = User::where('student_id', $student->id)->first();
            }
        }

        // 3. Tìm theo Mã GV
        if (!$user) {
            $teacher = Teacher::where('teacher_code', $loginValue)->first();
            if ($teacher) {
                $user = User::where('teacher_id', $teacher->id)->first();
            }
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false, 
                'message' => 'Sai tài khoản hoặc mật khẩu!'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success'      => true, // Quan trọng để React navigate
            'message'      => 'Đăng nhập thành công!',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'role'         => $user->role,
            'user'         => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'success' => true,
            'message' => 'Đã đăng xuất thành công!'
        ]);
    }
}