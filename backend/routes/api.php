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

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('sinh-vien', SinhVienController::class);
    Route::apiResource('classes', ClassController::class);
    Route::apiResource('teachers', TeacherController::class);
    Route::apiResource('subjects', SubjectController::class);
    Route::post('/attendance', [AttendanceController::class, 'store']);
    // Thêm dòng này để xem danh sách sinh viên đã điểm danh trong 1 phiên
    Route::get('/attendance/session/{sessionId}', [AttendanceController::class, 'getRoomStatus']);
    
    // Thêm dòng này nếu bạn muốn sinh viên xem lại lịch sử của chính họ
    Route::get('/attendance/history', [AttendanceController::class, 'studentHistory']);
    Route::get('/attendance/export/{sessionId}', [AttendanceController::class, 'exportExcel']);
});
