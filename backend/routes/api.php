<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SinhVienController;
use App\Http\Controllers\Api\LopHocController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\AttendanceController;

// 1. CÁC ROUTE KHÔNG CẦN ĐĂNG NHẬP (PUBLIC)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); // ĐƯA RA NGOÀI NÀY

// 2. CÁC ROUTE BẮT BUỘC PHẢI ĐĂNG NHẬP (PROTECTED)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('sinh-vien', SinhVienController::class);
    Route::apiResource('classes', ClassController::class);
    Route::apiResource('teachers', TeacherController::class);
    Route::apiResource('subjects', SubjectController::class);
    Route::post('/attendance', [AttendanceController::class, 'store']);
    Route::get('/attendance/session/{sessionId}', [AttendanceController::class, 'getRoomStatus']);
    
    // ĐÃ CẮT DÒNG REGISTER KHỎI ĐÂY
    
    Route::get('/attendance/history', [AttendanceController::class, 'studentHistory']);
    Route::get('/attendance/export/{sessionId}', [AttendanceController::class, 'exportExcel']);
});