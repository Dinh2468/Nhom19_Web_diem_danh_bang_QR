<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    // 1. Chỉ định rõ tên bảng
    protected $table = 'teachers';

    // 2. Tắt timestamps vì các cột của Vũ đang là NULL và có thể gây lỗi định dạng
    public $timestamps = false;

    // 3. Khai báo các cột có trong database của Vũ
    protected $fillable = [
        'teacher_code',
        'full_name',
        'email'
    ];
}