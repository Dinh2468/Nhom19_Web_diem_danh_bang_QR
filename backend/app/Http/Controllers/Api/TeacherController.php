<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Teacher::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_code' => 'required|unique:teachers',
            'full_name' => 'required',
            'email' => 'required|email|unique:teachers'
        ]);
        
        $teacher = Teacher::create($validated);
        
        return response()->json($teacher, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Teacher $teacher)
    {
        // Laravel đã tự tìm thấy $teacher, chỉ việc trả về thôi
        return response()->json($teacher, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Teacher $teacher)
    {
       // "Hãy kiểm tra unique, nhưng bỏ qua ID của giảng viên hiện tại"
        $validated = $request->validate([
            'teacher_code' => 'required|unique:teachers,teacher_code,' . $teacher->id,
            'full_name' => 'required',
            'email' => 'required|email|unique:teachers,email,' . $teacher->id
        ]);

        $teacher->update($validated);
        
        return response()->json($teacher, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher)
    {
        // Gọi hàm delete() trực tiếp
        $teacher->delete();
        
        return response()->json(null, 204);
    }
}