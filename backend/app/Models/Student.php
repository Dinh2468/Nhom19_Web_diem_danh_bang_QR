<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Thêm HasFactory cho đúng chuẩn Laravel
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';

    // Các trường được phép nạp dữ liệu hàng loạt
    protected $fillable = [
        'student_code',
        'full_name',
        'email',
        'class_id'
    ];

    public $timestamps = true;

    /**
     * Thiết lập quan hệ: Một sinh viên thuộc về một lớp học
     */
    public function classroom()
    {
        // Đảm bảo ClassModel là tên file model lớp học của bạn
        return $this->belongsTo(Classroom::class, 'class_id');
    }
}
