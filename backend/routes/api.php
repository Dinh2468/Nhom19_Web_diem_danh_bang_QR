<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan; // Thêm dòng này vào
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Models\User;
// API cho các bạn Frontend lấy danh sách sinh viên
Route::get('/sinh-vien', function () {
    return User::all();
});

use App\Http\Controllers\Api\SinhVienController;

Route::apiResource('sinh-vien', SinhVienController::class);

Route::get('/run-migrate', function () {
    Artisan::call('migrate:fresh --seed --force');
    return "Đã cập nhật Database thành công!";
});
