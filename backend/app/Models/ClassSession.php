<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassSession extends Model
{
    protected $fillable = [
        'course_id', 
        'session_date', 
        'start_time', 
        'end_time', 
        'room', 
        'qr_token', 
        'expired_at'
    ];

    // Buổi học thuộc về 1 Lớp học phần
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }


    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'session_id');
    }
}
