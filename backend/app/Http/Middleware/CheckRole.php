<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        // Nếu user chưa đăng nhập hoặc có Role không khớp với Role yêu cầu -> Chặn
        if (!$request->user() || $request->user()->role !== $role) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập chức năng này!'
            ], 403); // 403 Forbidden
        }

        return $next($request);
    }
}