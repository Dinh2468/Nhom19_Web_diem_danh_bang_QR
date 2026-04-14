<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    public function index()
    {
        return response()->json(Teacher::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_code' => 'required|unique:teachers',
            'full_name' => 'required',
            'email' => 'required|email|unique:teachers|unique:users,email'
        ]);

        // Dùng Transaction để đảm bảo nếu tạo User lỗi thì Teacher cũng không được tạo
        return DB::transaction(function () use ($validated) {
            // 1. Tạo bản ghi Giảng viên
            $teacher = Teacher::create($validated);

            // 2. Tự động tạo tài khoản Đăng nhập (Mật khẩu mặc định là 123456)
            User::create([
                'name' => $validated['full_name'],
                'email' => $validated['email'],
                'password' => Hash::make('123456'), // Mã hóa Bcrypt
                'role' => 'teacher',
                'teacher_id' => $teacher->id, // Liên kết với ID vừa tạo
            ]);

            return response()->json($teacher, 201);
        });
    }

    public function show(Teacher $teacher)
    {
        return response()->json($teacher, 200);
    }

    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'teacher_code' => 'required|unique:teachers,teacher_code,' . $teacher->id,
            'full_name' => 'required',
            'email' => 'required|email|unique:teachers,email,' . $teacher->id
        ]);

        return DB::transaction(function () use ($validated, $teacher) {
            // Cập nhật thông tin ở bảng teachers
            $teacher->update($validated);

            // Cập nhật đồng bộ Email/Tên ở bảng users (nếu có thay đổi)
            User::where('teacher_id', $teacher->id)->update([
                'name' => $validated['full_name'],
                'email' => $validated['email']
            ]);

            return response()->json($teacher, 200);
        });
    }

    public function destroy(Teacher $teacher)
    {
        return DB::transaction(function () use ($teacher) {
            // Xóa tài khoản login trước
            User::where('teacher_id', $teacher->id)->delete();
            
            // Xóa thông tin giảng viên sau
            $teacher->delete();

            return response()->json(null, 204);
        });
    }
}