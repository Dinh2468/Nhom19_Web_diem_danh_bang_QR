<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassSession extends Model
{
    protected $table = 'class_sessions';
    protected $fillable = ['course_id', 'session_date', 'start_time', 'end_time', 'qr_token', 'expired_at'];
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'session_id');
    }
}
