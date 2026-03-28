<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Classroom;

class LopHocController extends Controller
{
    public function index()
    {
        // Lấy toàn bộ danh sách lớp học từ database
        $classes = Classroom::all();

        return response()->json([
            'status' => 'success',
            'data' => $classes
        ]);
    }
}
