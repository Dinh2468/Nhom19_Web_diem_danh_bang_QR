<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * API Đăng nhập đa năng (Email / MSSV / MSGV)
     */
    public function login(Request $request)
    {
        $request->validate([
            'login_id' => 'required',
            'password' => 'required',
        ]);

        $loginId = $request->login_id;
        $user = null;

        if (filter_var($loginId, FILTER_VALIDATE_EMAIL)) {
            $user = User::where('email', $loginId)->first();
        } else {
            $student = Student::where('student_code', $loginId)->first();
            if ($student) {
                $user = User::where('student_id', $student->id)->first();
            } else {
                $teacher = Teacher::where('teacher_code', $loginId)->first();
                if ($teacher) {
                    $user = User::where('teacher_id', $teacher->id)->first();
                }
            }
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Thông tin đăng nhập không chính xác.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        if ($user->role === 'student' && $user->student_id) {
            $student = \App\Models\Student::find($user->student_id);
            if ($student) {
                // Đính kèm student_code vào object user để frontend nhận được
                $user->student_code = $student->student_code;
            }
        }
        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    /**
     * API Đăng ký và tự cấp mã định danh
     */
    // public function register(Request $request)
    // {
    //     $request->validate([
    //         'name'     => 'required|string|max:255',
    //         'email'    => 'required|string|email|unique:users,email',
    //         'password' => 'required|string|min:6|confirmed',
    //         'role'     => 'required|string|in:student,teacher',
    //     ]);

    //     $role = $request->role;

    //     return DB::transaction(function () use ($request, $role) {
    //         $studentId = null;
    //         $teacherId = null;
    //         $prefix = '';

    //         // BƯỚC 1: Sinh mã duy nhất
    //         do {
    //             $generatedId = ($role === 'student' ? 'SV' : 'GV') . rand(10000, 99999);
    //             $exists = ($role === 'student')
    //                 ? Student::where('student_code', $generatedId)->exists()
    //                 : Teacher::where('teacher_code', $generatedId)->exists();
    //         } while ($exists);

    //         // BƯỚC 2: Tạo hồ sơ chi tiết (Tách riêng khỏi User::create để tránh lỗi syntax)
    //         if ($role === 'student') {
    //             $student = Student::create([
    //                 'student_code' => $generatedId,
    //                 'full_name'    => $request->name,
    //                 'email'        => $request->email,
    //                 'class_id'     => 1, // Mặc định lớp 1 để tránh lỗi NOT NULL
    //             ]);
    //             $studentId = $student->id;
    //             $prefix = 'SV_';
    //         } else {
    //             $teacher = Teacher::create([
    //                 'teacher_code' => $generatedId,
    //                 'full_name'    => $request->name,
    //                 'email'        => $request->email,
    //             ]);
    //             $teacherId = $teacher->id;
    //             $prefix = 'GV_';
    //         }

    //         // BƯỚC 3: Tạo tài khoản User liên kết
    //         $user = User::create([
    //             'name'       => $request->name,
    //             'email'      => $request->email,
    //             'password'   => Hash::make($request->password),
    //             'role'       => $role,
    //             'qr_token'   => $prefix . Str::upper(Str::random(10)),
    //             'student_id' => $studentId,
    //             'teacher_id' => $teacherId,
    //         ]);

    //         $token = $user->createToken('auth_token')->plainTextToken;

    //         if ($user->role === 'student' && $user->student_id) {
    //             $student = Student::find($user->student_id);
    //             $user->student_code = $student ? $student->student_code : null;
    //         }

    //         return response()->json([
    //             'message' => 'Đăng ký thành công!',
    //             'registration_details' => [
    //                 'assigned_code' => $generatedId,
    //                 'email'         => $user->email,
    //                 'name'          => $user->name,
    //                 'role'          => $role
    //             ],
    //             'access_token' => $token,
    //             'token_type'   => 'Bearer',
    //             'user'         => $user
    //         ], 201);
    //     });
    // }

    /**
     * Đăng xuất xóa Token
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đã đăng xuất thành công.'
        ]);
    }
}
