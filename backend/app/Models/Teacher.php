<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Thêm chuẩn Laravel
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    // Chỉ định rõ tên bảng để tránh Laravel tự đoán sai
    protected $table = 'teachers';
    public $timestamps = true;

    // Các trường được phép nạp dữ liệu hàng loạt (đã khớp với AuthController)
    protected $fillable = [
        'teacher_code',
        'full_name',
        'email'
    ];

    /**
     * Quan hệ: Một giáo viên có thể dạy nhiều môn học/khóa học
     */
    public function courses()
    {
        // Đảm bảo bạn đã có Model Course.php
        return $this->hasMany(Course::class, 'teacher_id');
    }
}
