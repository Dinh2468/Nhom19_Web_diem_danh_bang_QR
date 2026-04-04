<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SinhVienController;
use App\Http\Controllers\Api\LopHocController;
use App\Http\Controllers\TeacherController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Đường dẫn: /api/sinh-vien
Route::apiResource('sinh-vien', SinhVienController::class);
// Đường dẫn: /api/lop-hoc
Route::get('/lop-hoc', [LopHocController::class, 'index']);
Route::apiResource('teachers', TeacherController::class);
