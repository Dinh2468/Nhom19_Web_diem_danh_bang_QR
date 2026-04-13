<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\SinhVienController;

// =============================================================
// 1. AUTHENTICATION (Public - Không cần Token)
// =============================================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); // Sửa lỗi 404 Register


// =============================================================
// 2. CÁC ROUTE CẦN ĐĂNG NHẬP (Bọc trong Middleware Sanctum)
// =============================================================
Route::middleware('auth:sanctum')->group(function () {
    
    // --- Đăng xuất ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user-profile', [AuthController::class, 'profile']);

    // --- Quản lý Sinh viên ---
    Route::get('/students', [SinhVienController::class, 'index']);
    Route::post('/students', [SinhVienController::class, 'store']);
    Route::put('/students/{id}', [SinhVienController::class, 'update']);
    Route::delete('/students/{id}', [SinhVienController::class, 'destroy']);

    // --- Quản lý Lớp học ---
    Route::get('/classes', [ClassController::class, 'index']);
    Route::post('/classes', [ClassController::class, 'store']);
    Route::put('/classes/{id}', [ClassController::class, 'update']);
    Route::delete('/classes/{id}', [ClassController::class, 'destroy']);

    // --- Quản lý Môn học ---
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::post('/subjects', [SubjectController::class, 'store']);
    Route::put('/subjects/{id}', [SubjectController::class, 'update']);
    Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);

    // --- Quản lý Khóa học & Giảng viên ---
    Route::get('/courses', [CourseController::class, 'index']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
    Route::get('/teachers', [TeacherController::class, 'index']);
});

// Route dự phòng nếu chưa đăng nhập mà cố tình gọi API cần quyền
Route::get('/login-error', function() {
    return response()->json(['success' => false, 'message' => 'Unauthorized - Vui lòng đăng nhập'], 401);
})->name('login');