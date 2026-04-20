<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\SinhVienController;
use App\Http\Controllers\Api\TeacherController;

// THÊM 2 DÒNG NÀY CHO TÍNH NĂNG MỚI
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\ClassSessionController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. CÁC ROUTE CÔNG KHAI
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/export/{sessionId}', [AttendanceController::class, 'exportExcel']);
// 2. CÁC ROUTE YÊU CẦU ĐĂNG NHẬP
Route::middleware('auth:sanctum')->group(function () {

    // Thông tin cá nhân & Đăng xuất
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Quản lý nhân sự & Học tập (Cũ)
    Route::apiResource('teachers', TeacherController::class);
    Route::apiResource('sinh-vien', SinhVienController::class);
    Route::apiResource('classes', ClassController::class);
    Route::apiResource('subjects', SubjectController::class);
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // ---------------------------------------------------
    // PHẦN MỚI THÊM: LỚP HỌC PHẦN & BUỔI HỌC
    // ---------------------------------------------------
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('class-sessions', ClassSessionController::class);
    // Route tạo nhanh 15 buổi học
    Route::post('class-sessions/generate', [ClassSessionController::class, 'generateSchedule']);
    // ---------------------------------------------------

    // Nghiệp vụ Điểm danh (Đã tích hợp phần mới)
    Route::prefix('attendance')->group(function () {
        Route::post('/', [AttendanceController::class, 'store']);

        // Cũ: Xem danh sách Realtime
        Route::get('/session/{sessionId}', [AttendanceController::class, 'getRoomStatus']);

        // MỚI: API tạo QR Token động cho Giảng viên
        Route::get('/generate-token/{sessionId}', [AttendanceController::class, 'generateQRToken']);

        Route::get('/history', [AttendanceController::class, 'studentHistory']);
    });
    Route::middleware(['auth:sanctum', 'role:teacher'])->group(function () {
        Route::get('/attendance/generate-token/{sessionId}', [AttendanceController::class, 'generateQRToken']);
    });
    // ---------------------------------------------------
    // PHẦN MỚI THÊM: DASHBOARD THỐNG KÊ
    // ---------------------------------------------------
    Route::get('/dashboard/course/{courseId}', [AttendanceController::class, 'getCourseStatistics']);
});
