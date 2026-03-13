<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User; // Hoặc Model SinhVien của bạn

class SinhVienController extends Controller
{
    // 1. Lấy danh sách (Read)
    public function index()
    {
        return response()->json(User::all());
    }

    // 2. Thêm mới (Create)
    public function store(Request $request)
    {
        $sv = User::create($request->all());
        return response()->json(['message' => 'Thêm thành công', 'data' => $sv]);
    }

    // 3. Xem chi tiết (Read detail)
    public function show($id)
    {
        return response()->json(User::findOrFail($id));
    }

    // 4. Cập nhật (Update)
    public function update(Request $request, $id)
    {
        $sv = User::findOrFail($id);
        $sv->update($request->all());
        return response()->json(['message' => 'Cập nhật thành công', 'data' => $sv]);
    }

    // 5. Xóa (Delete)
    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(['message' => 'Xóa thành công']);
    }
}
