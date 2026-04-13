<?php

// PHẢI CÓ CHỮ \Api Ở ĐÂY VÌ FILE NẰM TRONG THƯ MỤC Api
namespace App\Http\Controllers\Api; 

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    public function index()
    {
        try {
            // Dùng DB table để né lỗi cấu hình Model
            $teachers = DB::table('teachers')->get();
            
            return response()->json([
                'success' => true,
                'data' => $teachers
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi DB: ' . $e->getMessage() 
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $id = DB::table('teachers')->insertGetId($request->all());
            $teacher = DB::table('teachers')->where('id', $id)->first();
            return response()->json(['success' => true, 'data' => $teacher], 201);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    public function show($id)
    {
        $teacher = DB::table('teachers')->where('id', $id)->first();
        return $teacher ? response()->json($teacher) : response()->json(['message' => 'Not found'], 404);
    }

    public function update(Request $request, $id)
    {
        try {
            DB::table('teachers')->where('id', $id)->update($request->except(['id']));
            $teacher = DB::table('teachers')->where('id', $id)->first();
            return response()->json($teacher);
        } catch (Exception $e) {
            return response(null, 404);
        }
    }

    public function destroy($id)
    {
        DB::table('teachers')->where('id', $id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}