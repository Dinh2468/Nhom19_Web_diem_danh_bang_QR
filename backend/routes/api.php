<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SinhVienController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Đường dẫn: /api/sinh-vien
Route::apiResource('sinh-vien', SinhVienController::class);
