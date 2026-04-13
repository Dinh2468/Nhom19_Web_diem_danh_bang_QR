<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\SinhVienController;
use App\Http\Controllers\TeacherController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. CÁC ROUTE CÔNG KHAI (Không cần Token)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// 2. CÁC ROUTE YÊU CẦU ĐĂNG NHẬP (Cần Bearer Token)
Route::middleware('auth:sanctum')->group(function () {

    // Lấy thông tin User đang đăng nhập
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Đăng xuất
    Route::post('/logout', [AuthController::class, 'logout']);

    // Quản lý nghiệp vụ
    Route::apiResource('sinh-vien', SinhVienController::class);
    Route::apiResource('classes', ClassController::class);
    Route::apiResource('teachers', TeacherController::class);
    Route::apiResource('subjects', SubjectController::class);

    // Điểm danh
    Route::post('/attendance', [AttendanceController::class, 'store']);
    Route::get('/attendance/session/{sessionId}', [AttendanceController::class, 'getRoomStatus']);
    Route::get('/attendance/history', [AttendanceController::class, 'studentHistory']);
    Route::get('/attendance/export/{sessionId}', [AttendanceController::class, 'exportExcel']);
});
