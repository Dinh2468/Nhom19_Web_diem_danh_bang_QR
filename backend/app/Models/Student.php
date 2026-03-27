<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $table = 'students'; // Đảm bảo đúng tên bảng
    protected $fillable = ['student_code', 'full_name', 'email', 'class_id'];

    // Thêm dòng này để tránh lỗi sập web do thiếu timestamps
    public $timestamps = false;
    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'class_id');
    }
}
